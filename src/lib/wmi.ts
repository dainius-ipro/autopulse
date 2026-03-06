// WMI (World Manufacturer Identifier) - first 3 chars of VIN
// Source: NHTSA public WMI registry + ISO 3780
export var WMI_DB: Record<string, { make: string; country: string; type?: string }> = {
  // GERMANY
  "WBA": { make: "BMW", country: "Germany" },
  "WBS": { make: "BMW M", country: "Germany" },
  "WBY": { make: "BMW i", country: "Germany" },
  "WDB": { make: "Mercedes-Benz", country: "Germany" },
  "WDC": { make: "Mercedes-Benz", country: "Germany", type: "SUV/Truck" },
  "WDD": { make: "Mercedes-Benz", country: "Germany" },
  "WDF": { make: "Mercedes-Benz", country: "Germany", type: "Van" },
  "WMW": { make: "MINI", country: "Germany" },
  "WVW": { make: "Volkswagen", country: "Germany" },
  "WVG": { make: "Volkswagen", country: "Germany", type: "SUV" },
  "WV1": { make: "Volkswagen Commercial", country: "Germany" },
  "WV2": { make: "Volkswagen", country: "Germany", type: "Van/Bus" },
  "WAU": { make: "Audi", country: "Germany" },
  "WUA": { make: "Audi Quattro", country: "Germany" },
  "WP0": { make: "Porsche", country: "Germany" },
  "WP1": { make: "Porsche", country: "Germany", type: "SUV" },
  "WF0": { make: "Ford", country: "Germany" },
  "WJR": { make: "Opel", country: "Germany" },
  "W0L": { make: "Opel", country: "Germany" },
  "W0V": { make: "Opel", country: "Germany" },
  // JAPAN
  "JTD": { make: "Toyota", country: "Japan" },
  "JTE": { make: "Toyota", country: "Japan" },
  "JTH": { make: "Lexus", country: "Japan" },
  "JHM": { make: "Honda", country: "Japan" },
  "JHL": { make: "Honda", country: "Japan", type: "SUV/Truck" },
  "JN1": { make: "Nissan", country: "Japan" },
  "JN8": { make: "Nissan", country: "Japan", type: "SUV" },
  "JF1": { make: "Subaru", country: "Japan" },
  "JF2": { make: "Subaru", country: "Japan" },
  "JMZ": { make: "Mazda", country: "Japan" },
  "JM1": { make: "Mazda", country: "Japan" },
  "JS3": { make: "Suzuki", country: "Japan" },
  "JSA": { make: "Suzuki", country: "Japan" },
  "JYA": { make: "Yamaha", country: "Japan", type: "Motorcycle" },
  "JKA": { make: "Kawasaki", country: "Japan", type: "Motorcycle" },
  // SOUTH KOREA
  "KMH": { make: "Hyundai", country: "South Korea" },
  "KNA": { make: "Kia", country: "South Korea" },
  "KND": { make: "Kia", country: "South Korea", type: "SUV" },
  "KNM": { make: "Renault Samsung", country: "South Korea" },
  "KPT": { make: "SsangYong", country: "South Korea" },
  // USA
  "1FA": { make: "Ford", country: "USA" },
  "1FB": { make: "Ford", country: "USA", type: "Van" },
  "1FC": { make: "Ford", country: "USA", type: "Truck" },
  "1FD": { make: "Ford", country: "USA", type: "Truck" },
  "1FM": { make: "Ford", country: "USA", type: "SUV" },
  "1FT": { make: "Ford", country: "USA", type: "Truck" },
  "1G1": { make: "Chevrolet", country: "USA" },
  "1GC": { make: "Chevrolet", country: "USA", type: "Truck" },
  "1GN": { make: "Chevrolet/GMC", country: "USA", type: "SUV" },
  "1GT": { make: "GMC", country: "USA", type: "Truck" },
  "1GK": { make: "GMC", country: "USA" },
  "1G6": { make: "Cadillac", country: "USA" },
  "1G4": { make: "Buick", country: "USA" },
  "1LN": { make: "Lincoln", country: "USA" },
  "1N4": { make: "Nissan", country: "USA" },
  "1HG": { make: "Honda", country: "USA" },
  "1C4": { make: "Chrysler/Jeep", country: "USA" },
  "1C3": { make: "Chrysler", country: "USA" },
  "1J4": { make: "Jeep", country: "USA" },
  "1J8": { make: "Jeep", country: "USA" },
  "2FA": { make: "Ford", country: "Canada" },
  "2FM": { make: "Ford", country: "Canada", type: "SUV" },
  "2HG": { make: "Honda", country: "Canada" },
  "2HN": { make: "Acura", country: "Canada" },
  "2T1": { make: "Toyota", country: "Canada" },
  "3FA": { make: "Ford", country: "Mexico" },
  "3VW": { make: "Volkswagen", country: "Mexico" },
  "3N1": { make: "Nissan", country: "Mexico" },
  // UK
  "SAL": { make: "Land Rover", country: "UK" },
  "SAJ": { make: "Jaguar", country: "UK" },
  "SAR": { make: "Rover", country: "UK" },
  "SCA": { make: "Rolls-Royce", country: "UK" },
  "SCB": { make: "Bentley", country: "UK" },
  "SCF": { make: "Aston Martin", country: "UK" },
  "SCC": { make: "Lotus", country: "UK" },
  "SFZ": { make: "McLaren", country: "UK" },
  "SBM": { make: "McLaren", country: "UK" },
  // FRANCE
  "VF1": { make: "Renault", country: "France" },
  "VF3": { make: "Peugeot", country: "France" },
  "VF7": { make: "Citroen", country: "France" },
  "VF8": { make: "Peugeot", country: "France" },
  "VNV": { make: "Renault", country: "France" },
  "VR1": { make: "DS Automobiles", country: "France" },
  // ITALY
  "ZAR": { make: "Alfa Romeo", country: "Italy" },
  "ZCF": { make: "Iveco", country: "Italy" },
  "ZFA": { make: "Fiat", country: "Italy" },
  "ZFF": { make: "Ferrari", country: "Italy" },
  "ZHW": { make: "Lamborghini", country: "Italy" },
  "ZLA": { make: "Lancia", country: "Italy" },
  "ZAM": { make: "Maserati", country: "Italy" },
  "ZDM": { make: "Ducati", country: "Italy", type: "Motorcycle" },
  // SPAIN
  "VSS": { make: "SEAT", country: "Spain" },
  "VS6": { make: "Ford", country: "Spain" },
  // CZECH
  "TMB": { make: "Skoda", country: "Czech Republic" },
  "TMP": { make: "Skoda", country: "Czech Republic" },
  // SWEDEN
  "YV1": { make: "Volvo", country: "Sweden" },
  "YV4": { make: "Volvo", country: "Sweden" },
  "YS3": { make: "Saab", country: "Sweden" },
  "YK1": { make: "Saab", country: "Sweden" },
  // ROMANIA
  "UU1": { make: "Dacia", country: "Romania" },
  // TURKEY
  "NMT": { make: "Toyota", country: "Turkey" },
  "NM0": { make: "Ford", country: "Turkey" },
  "NMB": { make: "Mercedes-Benz", country: "Turkey" },
  // CHINA
  "LFV": { make: "FAW-Volkswagen", country: "China" },
  "LSV": { make: "SAIC Volkswagen", country: "China" },
  "LBV": { make: "BMW Brilliance", country: "China" },
  "LFP": { make: "FAW Toyota", country: "China" },
  "LVS": { make: "Ford Changan", country: "China" },
  "LJ1": { make: "JAC", country: "China" },
  "LPS": { make: "Geely", country: "China" },
  "L6T": { make: "Geely", country: "China" },
  "LRW": { make: "Tesla", country: "China" },
  "LNB": { make: "BYD", country: "China" },
  // INDIA
  "MAT": { make: "Tata", country: "India" },
  "MA3": { make: "Suzuki India", country: "India" },
  "MAJ": { make: "Mahindra", country: "India" },
  // BRAZIL
  "9BW": { make: "Volkswagen", country: "Brazil" },
  "9BG": { make: "Chevrolet", country: "Brazil" },
  "93H": { make: "Honda", country: "Brazil" },
  "93Y": { make: "Renault", country: "Brazil" },
  // TESLA
  "5YJ": { make: "Tesla", country: "USA" },
  "7SA": { make: "Tesla", country: "USA" },
  // ELECTRIC / NEW
  "WBW": { make: "BMW", country: "Germany", type: "Electric" },
  "7PD": { make: "Rivian", country: "USA" },
  "YMK": { make: "Polestar", country: "Sweden" },
  // TRUCKS & COMMERCIAL
  "XLE": { make: "Volvo Trucks", country: "Belgium" },
  "YB1": { make: "Volvo Trucks", country: "Sweden" },
  "XLB": { make: "DAF", country: "Netherlands" },
  "WMA": { make: "MAN", country: "Germany", type: "Truck" },
  "YV2": { make: "Volvo Trucks", country: "Sweden" },
  "3AK": { make: "Freightliner", country: "USA", type: "Truck" },
  "4V4": { make: "Volvo Trucks", country: "USA" },
  // LITHUANIA common imports (additional patterns)
  "TRU": { make: "Audi", country: "Hungary" },
  "VN1": { make: "Renault", country: "France", type: "Van" },
  "WV0": { make: "Volkswagen", country: "Poland" },
};

// Year decode from VIN position 10
export var YEAR_CODES: Record<string, number> = {
  "A": 2010, "B": 2011, "C": 2012, "D": 2013, "E": 2014,
  "F": 2015, "G": 2016, "H": 2017, "J": 2018, "K": 2019,
  "L": 2020, "M": 2021, "N": 2022, "P": 2023, "R": 2024,
  "S": 2025, "T": 2026, "V": 2027, "W": 2028, "X": 2029,
  "Y": 2030, "1": 2031, "2": 2032, "3": 2033, "4": 2034,
  "5": 2035, "6": 2036, "7": 2037, "8": 2038, "9": 2039,
};

export function decodeWMI(vin: string) {
  var wmi = vin.substring(0, 3).toUpperCase();
  var entry = WMI_DB[wmi];
  var yearChar = vin.length >= 10 ? vin[9].toUpperCase() : "";
  var year = YEAR_CODES[yearChar] || null;
  if (entry) {
    return { wmi: wmi, make: entry.make, country: entry.country, type: entry.type || "Passenger", year: year, source: "wmi_offline" };
  }
  // Try first 2 chars as fallback
  var wmi2 = vin.substring(0, 2).toUpperCase();
  for (var key in WMI_DB) {
    if (key.substring(0, 2) === wmi2) {
      return { wmi: wmi, make: WMI_DB[key].make + " (approx)", country: WMI_DB[key].country, type: WMI_DB[key].type || "Passenger", year: year, source: "wmi_partial" };
    }
  }
  return { wmi: wmi, make: null, country: null, type: null, year: year, source: "unknown" };
}

export function validateVIN(vin: string): { valid: boolean; error?: string } {
  if (!vin) return { valid: false, error: "VIN is required" };
  vin = vin.replace(/[\s-]/g, "").toUpperCase();
  if (vin.length !== 17) return { valid: false, error: "VIN must be exactly 17 characters (got " + vin.length + ")" };
  if (/[IOQ]/.test(vin)) return { valid: false, error: "VIN cannot contain I, O, or Q" };
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return { valid: false, error: "VIN contains invalid characters" };
  // Check digit validation (position 9)
  var transliteration: Record<string, number> = {
    A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,J:1,K:2,L:3,M:4,N:5,P:7,R:9,S:2,T:3,U:4,V:5,W:6,X:7,Y:8,Z:9
  };
  var weights = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
  var sum = 0;
  for (var i = 0; i < 17; i++) {
    var c = vin[i];
    var val = /\d/.test(c) ? parseInt(c) : (transliteration[c] || 0);
    sum += val * weights[i];
  }
  var checkDigit = sum % 11;
  var expected = checkDigit === 10 ? "X" : String(checkDigit);
  if (vin[8] !== expected) {
    return { valid: true, error: "Check digit mismatch (expected " + expected + ", got " + vin[8] + ") - may be non-US VIN" };
  }
  return { valid: true };
}// WMI (World Manufacturer Identifier) - first 3 chars of VIN
// Source: NHTSA public WMI registry + ISO 3780
export var WMI_DB: Record<string, { make: string; country: string; type?: string }> = {
  // GERMANY
  "WBA": { make: "BMW", country: "Germany" },
  "WBS": { make: "BMW M", country: "Germany" },
  "WBY": { make: "BMW i", country: "Germany" },
  "WDB": { make: "Mercedes-Benz", country: "Germany" },
  "WDC": { make: "Mercedes-Benz", country: "Germany", type: "SUV/Truck" },
  "WDD": { make: "Mercedes-Benz", country: "Germany" },
  "WDF": { make: "Mercedes-Benz", country: "Germany", type: "Van" },
  "WMW": { make: "MINI", country: "Germany" },
  "WVW": { make: "Volkswagen", country: "Germany" },
  "WVG": { make: "Volkswagen", country: "Germany", type: "SUV" },
  "WV1": { make: "Volkswagen Commercial", country: "Germany" },
  "WV2": { make: "Volkswagen", country: "Germany", type: "Van/Bus" },
  "WAU": { make: "Audi", country: "Germany" },
  "WUA": { make: "Audi Quattro", country: "Germany" },
  "WP0": { make: "Porsche", country: "Germany" },
  "WP1": { make: "Porsche", country: "Germany", type: "SUV" },
  "WF0": { make: "Ford", country: "Germany" },
  "WJR": { make: "Opel", country: "Germany" },
  "W0L": { make: "Opel", country: "Germany" },
  "W0V": { make: "Opel", country: "Germany" },
  // JAPAN
  "JTD": { make: "Toyota", country: "Japan" },
  "JTE": { make: "Toyota", country: "Japan" },
  "JTH": { make: "Lexus", country: "Japan" },
  "JHM": { make: "Honda", country: "Japan" },
  "JHL": { make: "Honda", country: "Japan", type: "SUV/Truck" },
  "JN1": { make: "Nissan", country: "Japan" },
  "JN8": { make: "Nissan", country: "Japan", type: "SUV" },
  "JF1": { make: "Subaru", country: "Japan" },
  "JF2": { make: "Subaru", country: "Japan" },
  "JMZ": { make: "Mazda", country: "Japan" },
  "JM1": { make: "Mazda", country: "Japan" },
  "JS3": { make: "Suzuki", country: "Japan" },
  "JSA": { make: "Suzuki", country: "Japan" },
  "JYA": { make: "Yamaha", country: "Japan", type: "Motorcycle" },
  "JKA": { make: "Kawasaki", country: "Japan", type: "Motorcycle" },
  // SOUTH KOREA
  "KMH": { make: "Hyundai", country: "South Korea" },
  "KNA": { make: "Kia", country: "South Korea" },
  "KND": { make: "Kia", country: "South Korea", type: "SUV" },
  "KNM": { make: "Renault Samsung", country: "South Korea" },
  "KPT": { make: "SsangYong", country: "South Korea" },
  // USA
  "1FA": { make: "Ford", country: "USA" },
  "1FB": { make: "Ford", country: "USA", type: "Van" },
  "1FC": { make: "Ford", country: "USA", type: "Truck" },
  "1FD": { make: "Ford", country: "USA", type: "Truck" },
  "1FM": { make: "Ford", country: "USA", type: "SUV" },
  "1FT": { make: "Ford", country: "USA", type: "Truck" },
  "1G1": { make: "Chevrolet", country: "USA" },
  "1GC": { make: "Chevrolet", country: "USA", type: "Truck" },
  "1GN": { make: "Chevrolet/GMC", country: "USA", type: "SUV" },
  "1GT": { make: "GMC", country: "USA", type: "Truck" },
  "1GK": { make: "GMC", country: "USA" },
  "1G6": { make: "Cadillac", country: "USA" },
  "1G4": { make: "Buick", country: "USA" },
  "1LN": { make: "Lincoln", country: "USA" },
  "1N4": { make: "Nissan", country: "USA" },
  "1HG": { make: "Honda", country: "USA" },
  "1C4": { make: "Chrysler/Jeep", country: "USA" },
  "1C3": { make: "Chrysler", country: "USA" },
  "1J4": { make: "Jeep", country: "USA" },
  "1J8": { make: "Jeep", country: "USA" },
  "2FA": { make: "Ford", country: "Canada" },
  "2FM": { make: "Ford", country: "Canada", type: "SUV" },
  "2HG": { make: "Honda", country: "Canada" },
  "2HN": { make: "Acura", country: "Canada" },
  "2T1": { make: "Toyota", country: "Canada" },
  "3FA": { make: "Ford", country: "Mexico" },
  "3VW": { make: "Volkswagen", country: "Mexico" },
  "3N1": { make: "Nissan", country: "Mexico" },
  // UK
  "SAL": { make: "Land Rover", country: "UK" },
  "SAJ": { make: "Jaguar", country: "UK" },
  "SAR": { make: "Rover", country: "UK" },
  "SCA": { make: "Rolls-Royce", country: "UK" },
  "SCB": { make: "Bentley", country: "UK" },
  "SCF": { make: "Aston Martin", country: "UK" },
  "SCC": { make: "Lotus", country: "UK" },
  "SFZ": { make: "McLaren", country: "UK" },
  "SBM": { make: "McLaren", country: "UK" },
  // FRANCE
  "VF1": { make: "Renault", country: "France" },
  "VF3": { make: "Peugeot", country: "France" },
  "VF7": { make: "Citroen", country: "France" },
  "VF8": { make: "Peugeot", country: "France" },
  "VNV": { make: "Renault", country: "France" },
  "VR1": { make: "DS Automobiles", country: "France" },
  // ITALY
  "ZAR": { make: "Alfa Romeo", country: "Italy" },
  "ZCF": { make: "Iveco", country: "Italy" },
  "ZFA": { make: "Fiat", country: "Italy" },
  "ZFF": { make: "Ferrari", country: "Italy" },
  "ZHW": { make: "Lamborghini", country: "Italy" },
  "ZLA": { make: "Lancia", country: "Italy" },
  "ZAM": { make: "Maserati", country: "Italy" },
  "ZDM": { make: "Ducati", country: "Italy", type: "Motorcycle" },
  // SPAIN
  "VSS": { make: "SEAT", country: "Spain" },
  "VS6": { make: "Ford", country: "Spain" },
  // CZECH
  "TMB": { make: "Skoda", country: "Czech Republic" },
  "TMP": { make: "Skoda", country: "Czech Republic" },
  // SWEDEN
  "YV1": { make: "Volvo", country: "Sweden" },
  "YV4": { make: "Volvo", country: "Sweden" },
  "YS3": { make: "Saab", country: "Sweden" },
  "YK1": { make: "Saab", country: "Sweden" },
  // ROMANIA
  "UU1": { make: "Dacia", country: "Romania" },
  // TURKEY
  "NMT": { make: "Toyota", country: "Turkey" },
  "NM0": { make: "Ford", country: "Turkey" },
  "NMB": { make: "Mercedes-Benz", country: "Turkey" },
  // CHINA
  "LFV": { make: "FAW-Volkswagen", country: "China" },
  "LSV": { make: "SAIC Volkswagen", country: "China" },
  "LBV": { make: "BMW Brilliance", country: "China" },
  "LFP": { make: "FAW Toyota", country: "China" },
  "LVS": { make: "Ford Changan", country: "China" },
  "LJ1": { make: "JAC", country: "China" },
  "LPS": { make: "Geely", country: "China" },
  "L6T": { make: "Geely", country: "China" },
  "LRW": { make: "Tesla", country: "China" },
  "LNB": { make: "BYD", country: "China" },
  // INDIA
  "MAT": { make: "Tata", country: "India" },
  "MA3": { make: "Suzuki India", country: "India" },
  "MAJ": { make: "Mahindra", country: "India" },
  // BRAZIL
  "9BW": { make: "Volkswagen", country: "Brazil" },
  "9BG": { make: "Chevrolet", country: "Brazil" },
  "93H": { make: "Honda", country: "Brazil" },
  "93Y": { make: "Renault", country: "Brazil" },
  // TESLA
  "5YJ": { make: "Tesla", country: "USA" },
  "7SA": { make: "Tesla", country: "USA" },
  // ELECTRIC / NEW
  "WBW": { make: "BMW", country: "Germany", type: "Electric" },
  "7PD": { make: "Rivian", country: "USA" },
  "YMK": { make: "Polestar", country: "Sweden" },
  // TRUCKS & COMMERCIAL
  "XLE": { make: "Volvo Trucks", country: "Belgium" },
  "YB1": { make: "Volvo Trucks", country: "Sweden" },
  "XLB": { make: "DAF", country: "Netherlands" },
  "WMA": { make: "MAN", country: "Germany", type: "Truck" },
  "YV2": { make: "Volvo Trucks", country: "Sweden" },
  "3AK": { make: "Freightliner", country: "USA", type: "Truck" },
  "4V4": { make: "Volvo Trucks", country: "USA" },
  // LITHUANIA common imports (additional patterns)
  "TRU": { make: "Audi", country: "Hungary" },
  "VN1": { make: "Renault", country: "France", type: "Van" },
  "WV0": { make: "Volkswagen", country: "Poland" },
};

// Year decode from VIN position 10
export var YEAR_CODES: Record<string, number> = {
  "A": 2010, "B": 2011, "C": 2012, "D": 2013, "E": 2014,
  "F": 2015, "G": 2016, "H": 2017, "J": 2018, "K": 2019,
  "L": 2020, "M": 2021, "N": 2022, "P": 2023, "R": 2024,
  "S": 2025, "T": 2026, "V": 2027, "W": 2028, "X": 2029,
  "Y": 2030, "1": 2031, "2": 2032, "3": 2033, "4": 2034,
  "5": 2035, "6": 2036, "7": 2037, "8": 2038, "9": 2039,
};

export function decodeWMI(vin: string) {
  var wmi = vin.substring(0, 3).toUpperCase();
  var entry = WMI_DB[wmi];
  var yearChar = vin.length >= 10 ? vin[9].toUpperCase() : "";
  var year = YEAR_CODES[yearChar] || null;
  if (entry) {
    return { wmi: wmi, make: entry.make, country: entry.country, type: entry.type || "Passenger", year: year, source: "wmi_offline" };
  }
  // Try first 2 chars as fallback
  var wmi2 = vin.substring(0, 2).toUpperCase();
  for (var key in WMI_DB) {
    if (key.substring(0, 2) === wmi2) {
      return { wmi: wmi, make: WMI_DB[key].make + " (approx)", country: WMI_DB[key].country, type: WMI_DB[key].type || "Passenger", year: year, source: "wmi_partial" };
    }
  }
  return { wmi: wmi, make: null, country: null, type: null, year: year, source: "unknown" };
}

export function validateVIN(vin: string): { valid: boolean; error?: string } {
  if (!vin) return { valid: false, error: "VIN is required" };
  vin = vin.replace(/[\s-]/g, "").toUpperCase();
  if (vin.length !== 17) return { valid: false, error: "VIN must be exactly 17 characters (got " + vin.length + ")" };
  if (/[IOQ]/.test(vin)) return { valid: false, error: "VIN cannot contain I, O, or Q" };
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return { valid: false, error: "VIN contains invalid characters" };
  // Check digit validation (position 9)
  var transliteration: Record<string, number> = {
    A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,J:1,K:2,L:3,M:4,N:5,P:7,R:9,S:2,T:3,U:4,V:5,W:6,X:7,Y:8,Z:9
  };
  var weights = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
  var sum = 0;
  for (var i = 0; i < 17; i++) {
    var c = vin[i];
    var val = /\d/.test(c) ? parseInt(c) : (transliteration[c] || 0);
    sum += val * weights[i];
  }
  var checkDigit = sum % 11;
  var expected = checkDigit === 10 ? "X" : String(checkDigit);
  if (vin[8] !== expected) {
    return { valid: true, error: "Check digit mismatch (expected " + expected + ", got " + vin[8] + ") - may be non-US VIN" };
  }
  return { valid: true };
}
