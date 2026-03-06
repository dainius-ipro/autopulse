import { NextRequest, NextResponse } from "next/server";
import { getVinCache, putVinCache } from "@/lib/dynamo";
import { decodeWMI, validateVIN } from "@/lib/wmi";

var NHTSA_BATCH_URL = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValuesBatch/";

export async function POST(request: NextRequest) {
  try {
    var body = await request.json();
    var vins: string[] = body.vins || [];

    if (!Array.isArray(vins) || vins.length === 0) {
      return NextResponse.json({ error: "Provide { vins: [\"VIN1\", \"VIN2\", ...] }" }, { status: 400 });
    }
    if (vins.length > 50) {
      return NextResponse.json({ error: "Maximum 50 VINs per batch" }, { status: 400 });
    }

    var results: Record<string, any>[] = [];

    // Check cache first
    var uncached: string[] = [];
    for (var i = 0; i < vins.length; i++) {
      var vin = vins[i].replace(/[\s\-]/g, "").toUpperCase();
      var cached = await getVinCache(vin);
      if (cached) {
        cached.source = "cache";
        cached.cached = true;
        results.push(cached);
      } else {
        uncached.push(vin);
      }
    }

    // Batch decode uncached via NHTSA
    if (uncached.length > 0) {
      try {
        var batchStr = uncached.join(";");
        var res = await fetch(NHTSA_BATCH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: "format=json&data=" + encodeURIComponent(batchStr),
          signal: AbortSignal.timeout(15000),
        });
        var data = await res.json();

        if (data.Results) {
          for (var j = 0; j < data.Results.length; j++) {
            var r = data.Results[j];
            var v = (r.VIN || "").toUpperCase();
            if (!v) continue;
            var wmi = decodeWMI(v);
            var item: Record<string, any> = {
              vin: v,
              make: r.Make || wmi.make || null,
              model: r.Model || null,
              year: r.ModelYear ? parseInt(r.ModelYear) : wmi.year,
              body: r.BodyClass || null,
              engine: r.EngineModel || null,
              displacement: r.DisplacementL ? r.DisplacementL + "L" : null,
              cylinders: r.EngineCylinders || null,
              fuel: r.FuelTypePrimary || null,
              transmission: r.TransmissionStyle || null,
              drive: r.DriveType || null,
              plant_country: r.PlantCountry || wmi.country || null,
              manufacturer: r.Manufacturer || null,
              vehicle_type: r.VehicleType || null,
              source: r.ErrorCode === "0" ? "nhtsa" : "nhtsa_partial",
              decoded_at: new Date().toISOString(),
            };
            results.push(item);
            // Cache async
            if (item.make) {
              putVinCache(item).catch(function() {});
            }
          }
        }
      } catch (e) {
        // Fallback to WMI for failed batch
        for (var k = 0; k < uncached.length; k++) {
          var wmiFallback = decodeWMI(uncached[k]);
          results.push({
            vin: uncached[k],
            make: wmiFallback.make,
            year: wmiFallback.year,
            source: "wmi_offline",
          });
        }
      }
    }

    return NextResponse.json({
      count: results.length,
      cached: results.filter(function(r) { return r.cached; }).length,
      decoded: results.filter(function(r) { return !r.cached; }).length,
      results: results,
    });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
