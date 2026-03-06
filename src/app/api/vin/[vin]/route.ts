import { NextRequest, NextResponse } from "next/server";
import { getVinCache, putVinCache } from "@/lib/dynamo";
import { decodeWMI, validateVIN } from "@/lib/wmi";
import { manufacturerDecode } from "@/lib/manufacturer-decoders";
import { enrichFromRDW } from "@/lib/rdw-enrich";

var NHTSA_URL = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/";

var NHTSA_FIELDS: Record<string, string> = {
  Make: "make", Model: "model", ModelYear: "year", Trim: "trim",
  BodyClass: "body", EngineModel: "engine", DisplacementL: "displacement",
  EngineCylinders: "cylinders", FuelTypePrimary: "fuel",
  TransmissionStyle: "transmission", DriveType: "drive", Doors: "doors",
  PlantCountry: "plant_country", PlantCity: "plant_city",
  Manufacturer: "manufacturer", VehicleType: "vehicle_type",
  GVWR: "gvwr", ErrorCode: "error_code",
  EngineHP: "horsepower", Series: "series", SteeringLocation: "steering",
  EngineKW: "engine_kw", EngineBrakeHP: "engine_brake_hp",
};

async function decodeFromNHTSA(vin: string) {
  try {
    var res = await fetch(NHTSA_URL + vin + "?format=json", { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    var data = await res.json();
    if (!data.Results || data.Results.length === 0) return null;
    var r = data.Results[0];
    var result: Record<string, any> = {};
    for (var k in NHTSA_FIELDS) {
      var val = r[k];
      if (val && val !== "" && val !== "Not Applicable") {
        result[NHTSA_FIELDS[k]] = NHTSA_FIELDS[k] === "year" ? parseInt(val) : val;
      }
    }
    var rawCount = 0;
    for (var key in r) { if (r[key] && r[key] !== "" && r[key] !== "Not Applicable") rawCount++; }
    result.raw_fields = rawCount;
    result.nhtsa_error = r.ErrorCode || null;
    return result;
  } catch (e) {
    console.error("[NHTSA] error:", e);
    return null;
  }
}

function mergeResults(base: Record<string, any>, overlay: Record<string, any>): Record<string, any> {
  // Overlay fills in missing fields in base, never overwrites existing
  for (var key in overlay) {
    if (overlay[key] !== null && overlay[key] !== undefined) {
      if (!base[key] || base[key] === null || base[key] === undefined) {
        base[key] = overlay[key];
      }
    }
  }
  return base;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ vin: string }> }) {
  var { vin } = await params;
  vin = vin.replace(/[\s\-]/g, "").toUpperCase();

  // Validate
  var validation = validateVIN(vin);
  if (!validation.valid && vin.length !== 17) {
    return NextResponse.json({ error: validation.error, vin: vin }, { status: 400 });
  }

  // ═══ SOURCE 1: DynamoDB Cache ═══
  var cached = await getVinCache(vin);
  if (cached && cached.model) {
    return NextResponse.json({ ...cached, source: "cache", cached: true });
  }

  var sources: string[] = [];
  var result: Record<string, any> = { vin: vin };

  // ═══ SOURCE 2: WMI Offline (instant) ═══
  var wmiResult = decodeWMI(vin);
  if (wmiResult.make) {
    result.make = wmiResult.make;
    result.country = wmiResult.country;
    result.year = wmiResult.year;
    sources.push("wmi");
  }

  // ═══ SOURCE 3: NHTSA API ═══
  var nhtsa = await decodeFromNHTSA(vin);
  if (nhtsa) {
    mergeResults(result, {
      make: nhtsa.make,
      model: nhtsa.model,
      year: nhtsa.year,
      trim: nhtsa.trim,
      body: nhtsa.body,
      engine: nhtsa.engine,
      displacement: nhtsa.displacement ? nhtsa.displacement + "L" : null,
      cylinders: nhtsa.cylinders,
      fuel: nhtsa.fuel,
      transmission: nhtsa.transmission,
      drive: nhtsa.drive,
      doors: nhtsa.doors,
      plant_country: nhtsa.plant_country,
      plant_city: nhtsa.plant_city,
      manufacturer: nhtsa.manufacturer,
      vehicle_type: nhtsa.vehicle_type,
      horsepower: nhtsa.horsepower,
      engine_kw: nhtsa.engine_kw,
      series: nhtsa.series,
    });
    result.raw_fields = nhtsa.raw_fields || 0;
    if (nhtsa.nhtsa_error === "0") sources.push("nhtsa");
    else sources.push("nhtsa_partial");
  }

  // ═══ SOURCE 4: Manufacturer-specific decoder ═══
  var mfrDecode = manufacturerDecode(vin);
  if (mfrDecode) {
    mergeResults(result, {
      model: mfrDecode.model,
      body: mfrDecode.body,
      engine: mfrDecode.engine,
      year: mfrDecode.year,
      plant_city: mfrDecode.plant,
      series: mfrDecode.series,
      transmission: mfrDecode.transmission,
    });
    // Add manufacturer-specific extra fields
    if (mfrDecode.extra) {
      for (var ek in mfrDecode.extra) {
        if (!result[ek]) result[ek] = mfrDecode.extra[ek];
      }
    }
    sources.push("manufacturer_decode");
  }

  // ═══ SOURCE 5: RDW Netherlands enrichment ═══
  // Only call if we're still missing key fields
  if (!result.displacement || !result.fuel || !result.engine_power_hp) {
    var rdw = await enrichFromRDW(vin);
    if (rdw) {
      mergeResults(result, {
        model: rdw.model,
        variant: rdw.variant,
        version: rdw.version,
        body: rdw.body,
        fuel: rdw.fuel,
        displacement: rdw.engine_displacement ? rdw.engine_displacement + "cc" : null,
        engine_power_kw: rdw.engine_power_kw,
        engine_power_hp: rdw.engine_power_hp,
        weight_kg: rdw.weight_kg,
        seats: rdw.seats,
        type_approval: rdw.type_approval,
      });
      // RDW year can override if more accurate
      if (rdw.year && !result.year) {
        result.year = rdw.year;
      }
      sources.push("rdw_nl");
    }
  }

  // ═══ FINALIZE ═══
  result.source = sources.join(" + ");
  result.sources_used = sources.length;
  result.decoded_at = new Date().toISOString();
  result.validation = validation;

  // Calculate confidence score
  var filledFields = 0;
  var totalFields = ["make", "model", "year", "body", "engine", "displacement", "cylinders", "fuel", "transmission", "drive", "doors", "plant_country", "manufacturer", "vehicle_type", "horsepower"];
  for (var i = 0; i < totalFields.length; i++) {
    if (result[totalFields[i]]) filledFields++;
  }
  result.confidence = Math.round((filledFields / totalFields.length) * 100);

  // ═══ CACHE (async) ═══
  if (result.make) {
    putVinCache(result).catch(function(e) { console.error("[Cache] write failed:", e); });
  }

  return NextResponse.json(result);
}
