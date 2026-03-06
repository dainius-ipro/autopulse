// Manufacturer-specific VIN pattern decoders
// These supplement NHTSA data with detailed EU-spec decoding
// File: src/lib/manufacturer-decoders.ts

interface ManufacturerDecode {
  model: string | null;
  body: string | null;
  engine: string | null;
  year: number | null;
  plant: string | null;
  series: string | null;
  transmission: string | null;
  extra: Record<string, string>;
}

// === TOYOTA ===
var TOYOTA_MODEL_POS8: Record<string, string> = {
  "0": "MR2 Spyder", "1": "Tundra", "3": "Yaris", "4": "xB/xD",
  "A": "Highlander/Supra", "B": "Avalon", "C": "Sienna",
  "D": "T100", "E": "Corolla", "F": "FJ Cruiser", "G": "Hilux",
  "H": "Highlander", "J": "Land Cruiser", "K": "Camry",
  "L": "Tercel/Paseo", "M": "Previa", "N": "Tacoma",
  "P": "Camry Solara", "R": "4Runner", "T": "Celica",
  "U": "Prius", "V": "RAV4", "W": "MR2", "X": "Cressida",
};

var TOYOTA_ENGINE_POS5: Record<string, string> = {
  "A": "A-series (1.3-1.8L)", "B": "7A-FE", "C": "C-series",
  "D": "D-series Diesel", "E": "E-series", "F": "F-series",
  "G": "G-series (1.0-1.3L)", "H": "H-series", "K": "K-series",
  "L": "L-series Diesel", "M": "M-series", "N": "N-series",
  "P": "P-series", "R": "R-series (2.0-2.4L)", "S": "S-series (1.8-2.2L)",
  "T": "5S-FE", "U": "U-series", "Z": "Z-series (V6)",
};

var TOYOTA_BODY_POS4: Record<string, string> = {
  "A": "2-door sedan", "B": "4-door sedan", "C": "2-door coupe",
  "D": "5-door hatchback", "E": "4-door wagon", "F": "4-door sedan (luxury)",
  "G": "5-door wagon", "H": "SUV 5-door", "J": "SUV 5-door (large)",
  "K": "4-door sedan/hatch", "L": "4-door van", "M": "5-door van",
  "N": "truck cab", "P": "truck extra cab", "R": "truck double cab",
};

var TOYOTA_PLANTS: Record<string, string> = {
  "0": "Shimoyama, Japan", "1": "Tahara, Japan", "2": "Motomachi, Japan",
  "3": "Tsutsumi, Japan", "4": "Miyata, Japan", "5": "Georgetown, USA",
  "6": "Princeton, USA", "7": "Tsutsumi, Japan", "8": "Toyota City, Japan",
  "A": "Toyota City, Japan", "B": "Kyushu, Japan", "C": "Ontario, Canada",
  "D": "Toyota City, Japan", "E": "Burnaston, UK", "J": "Tahara, Japan",
  "K": "Derbyshire, UK", "M": "Baja California, Mexico", "P": "Princeton, USA",
  "R": "Toyota City, Japan", "U": "Georgetown, USA", "Z": "Fremont, USA (NUMMI)",
};

function decodeToyota(vin: string): ManufacturerDecode {
  var model = TOYOTA_MODEL_POS8[vin[7]] || null;
  var engine = TOYOTA_ENGINE_POS5[vin[4]] || null;
  var body = TOYOTA_BODY_POS4[vin[3]] || null;
  var plant = TOYOTA_PLANTS[vin[10]] || null;
  var year = decodeYear(vin[9]);

  return {
    model: model, body: body, engine: engine, year: year,
    plant: plant, series: vin.substring(3, 8), transmission: null,
    extra: { chassis_code: vin.substring(3, 8) },
  };
}

// === BMW ===
var BMW_MODEL_SERIES: Record<string, string> = {
  "A": "1 Series", "B": "1 Series", "C": "3 Series", "D": "3 Series",
  "E": "5 Series", "F": "5 Series", "G": "6 Series", "H": "6 Series",
  "J": "7 Series", "K": "7 Series", "L": "8 Series", "M": "Z3/Z4",
  "N": "Z3/Z4", "P": "MINI", "R": "X3", "S": "X5",
  "T": "X5", "U": "X6", "V": "X1", "W": "Z8",
};

var BMW_ENGINES: Record<string, string> = {
  "A": "N46 2.0L 4cyl", "B": "N46 2.0L 4cyl Turbo", "C": "N52 3.0L 6cyl",
  "D": "N54 3.0L 6cyl Twin Turbo", "E": "N55 3.0L 6cyl Turbo",
  "F": "N20 2.0L 4cyl Turbo", "G": "N63 4.4L V8 Twin Turbo",
  "H": "S65 4.0L V8 (M3)", "J": "B48 2.0L 4cyl Turbo",
  "K": "B58 3.0L 6cyl Turbo", "L": "S58 3.0L 6cyl Turbo (M)",
  "M": "N47 2.0L 4cyl Diesel", "N": "N57 3.0L 6cyl Diesel",
};

var BMW_PLANTS: Record<string, string> = {
  "A": "Munich, Germany", "B": "Dingolfing, Germany", "C": "Rosslyn, South Africa",
  "D": "Munich, Germany", "E": "Regensburg, Germany", "F": "Munich, Germany",
  "G": "Graz, Austria (Magna Steyr)", "H": "Shenyang, China",
  "K": "Leipzig, Germany", "L": "Spartanburg, USA", "M": "Chennai, India",
  "N": "Rosslyn, South Africa", "P": "Spartanburg, USA", "V": "Leipzig, Germany",
  "W": "Dingolfing, Germany",
};

function decodeBMW(vin: string): ManufacturerDecode {
  var model = BMW_MODEL_SERIES[vin[3]] || null;
  var engine = BMW_ENGINES[vin[6]] || null;
  var plant = BMW_PLANTS[vin[10]] || null;
  var year = decodeYear(vin[9]);

  return {
    model: model, body: null, engine: engine, year: year,
    plant: plant, series: vin.substring(3, 7), transmission: null,
    extra: { type_code: vin.substring(3, 7) },
  };
}

// === VOLKSWAGEN ===
var VW_MODELS: Record<string, string> = {
  "1": "Caddy", "2": "Golf/Jetta", "3": "Passat", "5": "Polo",
  "6": "Sharan", "7": "Touareg", "8": "Touran", "9": "Transporter",
  "A": "Golf", "B": "Jetta", "C": "New Beetle", "D": "Phaeton",
  "E": "Tiguan", "F": "ID.3", "G": "ID.4", "H": "Atlas",
  "K": "Arteon", "N": "Taos", "T": "T-Roc", "V": "T-Cross",
};

var VW_ENGINES: Record<string, string> = {
  "1": "1.0L TSI", "2": "1.2L TSI", "3": "1.4L TSI", "4": "1.5L TSI",
  "5": "1.6L TDI", "6": "1.8L TSI", "7": "2.0L TSI", "8": "2.0L TDI",
  "9": "3.0L V6 TDI", "A": "1.0L MPI", "B": "1.6L MPI",
  "D": "2.0L TDI BiTurbo", "E": "Electric", "F": "1.4L PHEV",
};

function decodeVW(vin: string): ManufacturerDecode {
  var model = VW_MODELS[vin[6]] || VW_MODELS[vin[7]] || null;
  var engine = VW_ENGINES[vin[4]] || null;
  var year = decodeYear(vin[9]);

  return {
    model: model, body: null, engine: engine, year: year,
    plant: null, series: vin.substring(3, 8), transmission: null,
    extra: { model_code: vin.substring(3, 8) },
  };
}

// === MERCEDES-BENZ ===
var MB_MODELS: Record<string, string> = {
  "A": "A-Class / CLA", "B": "B-Class", "C": "C-Class",
  "D": "C-Class Coupe", "E": "E-Class", "F": "E-Class Coupe/Cabrio",
  "G": "S-Class", "H": "SL", "J": "CLS", "K": "SLK/SLC",
  "L": "GLA", "M": "GLK/GLC", "N": "GLB", "P": "GLE/M-Class",
  "R": "GLS/GL", "S": "G-Class", "T": "GLE Coupe",
  "U": "AMG GT", "V": "V-Class/Vito", "W": "EQC/EQA/EQB",
};

function decodeMercedes(vin: string): ManufacturerDecode {
  var model = MB_MODELS[vin[6]] || MB_MODELS[vin[7]] || null;
  var year = decodeYear(vin[9]);

  return {
    model: model, body: null, engine: null, year: year,
    plant: null, series: vin.substring(3, 8), transmission: null,
    extra: { baumuster: vin.substring(3, 9) },
  };
}

// === YEAR DECODER ===
var YEAR_CODES: Record<string, number> = {
  "A": 2010, "B": 2011, "C": 2012, "D": 2013, "E": 2014,
  "F": 2015, "G": 2016, "H": 2017, "J": 2018, "K": 2019,
  "L": 2020, "M": 2021, "N": 2022, "P": 2023, "R": 2024,
  "S": 2025, "T": 2026, "V": 2027, "W": 2028, "X": 2029,
  "Y": 2030, "1": 2001, "2": 2002, "3": 2003, "4": 2004,
  "5": 2005, "6": 2006, "7": 2007, "8": 2008, "9": 2009,
};

function decodeYear(char: string): number | null {
  return YEAR_CODES[char.toUpperCase()] || null;
}

// === MAIN DISPATCHER ===
export function manufacturerDecode(vin: string): ManufacturerDecode | null {
  var wmi = vin.substring(0, 3).toUpperCase();
  var wmi2 = vin.substring(0, 2).toUpperCase();

  // Toyota
  if (["JT", "SB"].includes(wmi2) || ["NMT", "VNK", "2T1", "4T1", "5T"].some(function(p) { return wmi.startsWith(p); })) {
    return decodeToyota(vin);
  }
  // BMW
  if (["WB", "5U"].includes(wmi2) || ["WBA", "WBS", "WBY", "WBW", "4US"].includes(wmi)) {
    return decodeBMW(vin);
  }
  // Volkswagen
  if (["WV", "3V", "1V"].includes(wmi2) || ["WVW", "WVG", "WV1", "WV2"].includes(wmi)) {
    return decodeVW(vin);
  }
  // Mercedes-Benz
  if (["WD"].includes(wmi2) || ["WDB", "WDC", "WDD", "WDF", "4JG"].includes(wmi)) {
    return decodeMercedes(vin);
  }

  return null;
}
