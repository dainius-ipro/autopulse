// NHTSA vPIC API client - completely free, no API key needed
var NHTSA_BASE = "https://vpic.nhtsa.dot.gov/api/vehicles";

export interface NHTSAResult {
  make: string | null;
  model: string | null;
  year: number | null;
  trim: string | null;
  body: string | null;
  engine: string | null;
  displacement: string | null;
  cylinders: string | null;
  fuel: string | null;
  transmission: string | null;
  drive: string | null;
  doors: string | null;
  plant_country: string | null;
  plant_city: string | null;
  manufacturer: string | null;
  vehicle_type: string | null;
  gvwr: string | null;
  error_code: string | null;
  raw: Record<string, string>;
}

var FIELD_MAP: Record<string, string> = {
  "Make": "make",
  "Model": "model",
  "ModelYear": "year",
  "Trim": "trim",
  "BodyClass": "body",
  "EngineModel": "engine",
  "DisplacementL": "displacement",
  "EngineCylinders": "cylinders",
  "FuelTypePrimary": "fuel",
  "TransmissionStyle": "transmission",
  "DriveType": "drive",
  "Doors": "doors",
  "PlantCountry": "plant_country",
  "PlantCity": "plant_city",
  "Manufacturer": "manufacturer",
  "VehicleType": "vehicle_type",
  "GVWR": "gvwr",
  "ErrorCode": "error_code",
};

export async function decodeVIN_NHTSA(vin: string): Promise<NHTSAResult | null> {
  try {
    var url = NHTSA_BASE + "/DecodeVinValues/" + vin + "?format=json";
    var res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    var data = await res.json();
    if (!data.Results || data.Results.length === 0) return null;
    var r = data.Results[0];
    var result: any = { raw: {} };
    for (var nhtsaKey in FIELD_MAP) {
      var ourKey = FIELD_MAP[nhtsaKey];
      var val = r[nhtsaKey];
      if (val && val !== "" && val !== "Not Applicable") {
        result[ourKey] = ourKey === "year" ? parseInt(val) : val;
      } else {
        result[ourKey] = null;
      }
    }
    // Collect all non-empty raw fields
    for (var key in r) {
      if (r[key] && r[key] !== "" && r[key] !== "Not Applicable") {
        result.raw[key] = r[key];
      }
    }
    // Check if decode was successful
    if (result.error_code && result.error_code.startsWith("0")) {
      result.source = "nhtsa";
      return result as NHTSAResult;
    }
    // Partial decode still useful
    if (result.make) {
      result.source = "nhtsa_partial";
      return result as NHTSAResult;
    }
    return null;
  } catch (e) {
    console.error("NHTSA API error:", e);
    return null;
  }
}
