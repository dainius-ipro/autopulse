import { NextRequest, NextResponse } from "next/server";
import { getVinCache, putVinCache } from "@/lib/dynamo";
import { decodeWMI, validateVIN } from "@/lib/wmi";

var NHTSA_URL = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/";

var FIELD_MAP: Record<string, string> = {
  Make: "make", Model: "model", ModelYear: "year", Trim: "trim",
  BodyClass: "body", EngineModel: "engine", DisplacementL: "displacement",
  EngineCylinders: "cylinders", FuelTypePrimary: "fuel",
  TransmissionStyle: "transmission", DriveType: "drive", Doors: "doors",
  PlantCountry: "plant_country", PlantCity: "plant_city",
  Manufacturer: "manufacturer", VehicleType: "vehicle_type",
  GVWR: "gvwr", ErrorCode: "error_code",
  EngineHP: "horsepower", Series: "series", SteeringLocation: "steering",
};

async function decodeFromNHTSA(vin: string) {
  try {
    var res = await fetch(NHTSA_URL + vin + "?format=json", { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    var data = await res.json();
    if (!data.Results || data.Results.length === 0) return null;
    var r = data.Results[0];
    var result: Record<string, any> = {};
    for (var k in FIELD_MAP) {
      var val = r[k];
      if (val && val !== "" && val !== "Not Applicable") {
        result[FIELD_MAP[k]] = FIELD_MAP[k] === "year" ? parseInt(val) : val;
      }
    }
    var rawCount = 0;
    for (var key in r) { if (r[key] && r[key] !== "" && r[key] !== "Not Applicable") rawCount++; }
    result.raw_fields = rawCount;
    return result;
  } catch (e) {
    console.error("NHTSA error:", e);
    return null;
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ vin: string }> }) {
  var { vin } = await params;
  vin = vin.replace(/[\s\-]/g, "").toUpperCase();

  // Validate
  var validation = validateVIN(vin);
  if (!validation.valid && vin.length !== 17) {
    return NextResponse.json({ error: validation.error, vin: vin }, { status: 400 });
  }

  // 1. Check DynamoDB cache
  var cached = await getVinCache(vin);
  if (cached) {
    return NextResponse.json({
      ...cached,
      source: "cache",
      cached: true,
    });
  }

  // 2. WMI offline decode (instant fallback)
  var wmiResult = decodeWMI(vin);

  // 3. NHTSA API decode
  var nhtsa = await decodeFromNHTSA(vin);

  var result: Record<string, any> = {
    vin: vin,
    make: nhtsa?.make || wmiResult.make || null,
    model: nhtsa?.model || null,
    year: nhtsa?.year || wmiResult.year || null,
    trim: nhtsa?.trim || null,
    body: nhtsa?.body || null,
    engine: nhtsa?.engine || null,
    displacement: nhtsa?.displacement ? nhtsa.displacement + "L" : null,
    cylinders: nhtsa?.cylinders || null,
    fuel: nhtsa?.fuel || null,
    transmission: nhtsa?.transmission || null,
    drive: nhtsa?.drive || null,
    doors: nhtsa?.doors || null,
    plant_country: nhtsa?.plant_country || wmiResult.country || null,
    plant_city: nhtsa?.plant_city || null,
    manufacturer: nhtsa?.manufacturer || null,
    vehicle_type: nhtsa?.vehicle_type || null,
    horsepower: nhtsa?.horsepower || null,
    series: nhtsa?.series || null,
    source: nhtsa ? (nhtsa.error_code === "0" ? "nhtsa" : "nhtsa_partial") : "wmi_offline",
    raw_fields: nhtsa?.raw_fields || 0,
    decoded_at: new Date().toISOString(),
    validation: validation,
  };

  // 4. Cache in DynamoDB (async, don't block response)
  if (result.make) {
    putVinCache(result).catch(function(e) { console.error("Cache write failed:", e); });
  }

  return NextResponse.json(result);
}
