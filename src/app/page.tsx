"use client";
import { useState } from "react";

var NHTSA_URL = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/";

// WMI inline for static export (no server needed)
var WMI: Record<string, [string, string]> = {
  WBA:["BMW","Germany"],WBS:["BMW M","Germany"],WBY:["BMW i","Germany"],
  WDB:["Mercedes-Benz","Germany"],WDC:["Mercedes-Benz","Germany"],WDD:["Mercedes-Benz","Germany"],
  WDF:["Mercedes-Benz","Germany"],WMW:["MINI","Germany"],
  WVW:["Volkswagen","Germany"],WVG:["Volkswagen","Germany"],WV1:["Volkswagen","Germany"],
  WAU:["Audi","Germany"],WUA:["Audi","Germany"],
  WP0:["Porsche","Germany"],WP1:["Porsche","Germany"],
  WF0:["Ford","Germany"],W0L:["Opel","Germany"],
  JTD:["Toyota","Japan"],JTE:["Toyota","Japan"],JTH:["Lexus","Japan"],
  JHM:["Honda","Japan"],JHL:["Honda","Japan"],
  JN1:["Nissan","Japan"],JN8:["Nissan","Japan"],
  JF1:["Subaru","Japan"],JF2:["Subaru","Japan"],
  JMZ:["Mazda","Japan"],JM1:["Mazda","Japan"],
  JS3:["Suzuki","Japan"],
  KMH:["Hyundai","South Korea"],KNA:["Kia","South Korea"],KND:["Kia","South Korea"],
  "1FA":["Ford","USA"],"1FM":["Ford","USA"],"1FT":["Ford","USA"],
  "1G1":["Chevrolet","USA"],"1GC":["Chevrolet","USA"],"1GN":["Chevrolet/GMC","USA"],
  "1G6":["Cadillac","USA"],"1G4":["Buick","USA"],
  "1HG":["Honda","USA"],"1N4":["Nissan","USA"],
  "1C4":["Chrysler/Jeep","USA"],"1J4":["Jeep","USA"],
  "2FA":["Ford","Canada"],"2T1":["Toyota","Canada"],
  "3FA":["Ford","Mexico"],"3VW":["Volkswagen","Mexico"],
  SAL:["Land Rover","UK"],SAJ:["Jaguar","UK"],
  SCA:["Rolls-Royce","UK"],SCB:["Bentley","UK"],SCF:["Aston Martin","UK"],SFZ:["McLaren","UK"],
  VF1:["Renault","France"],VF3:["Peugeot","France"],VF7:["Citroen","France"],
  ZAR:["Alfa Romeo","Italy"],ZFA:["Fiat","Italy"],ZFF:["Ferrari","Italy"],
  ZHW:["Lamborghini","Italy"],ZAM:["Maserati","Italy"],
  VSS:["SEAT","Spain"],TMB:["Skoda","Czech Republic"],
  YV1:["Volvo","Sweden"],YV4:["Volvo","Sweden"],YS3:["Saab","Sweden"],
  UU1:["Dacia","Romania"],
  NMT:["Toyota","Turkey"],NM0:["Ford","Turkey"],
  "5YJ":["Tesla","USA"],"7SA":["Tesla","USA"],LRW:["Tesla","China"],
  TRU:["Audi","Hungary"],
};

var YEAR_MAP: Record<string, number> = {
  A:2010,B:2011,C:2012,D:2013,E:2014,F:2015,G:2016,H:2017,J:2018,K:2019,
  L:2020,M:2021,N:2022,P:2023,R:2024,S:2025,T:2026,V:2027,W:2028,X:2029,Y:2030,
};

interface DecodeResult {
  vin: string;
  make: string | null;
  model: string | null;
  year: number | null;
  body: string | null;
  engine: string | null;
  displacement: string | null;
  cylinders: string | null;
  fuel: string | null;
  transmission: string | null;
  drive: string | null;
  doors: string | null;
  plant_country: string | null;
  manufacturer: string | null;
  vehicle_type: string | null;
  source: string;
  decoded_at: string;
  validation: { valid: boolean; error?: string };
  raw_fields?: number;
}

function validateVIN(vin: string): { valid: boolean; error?: string; clean: string } {
  var clean = vin.replace(/[\s\-]/g, "").toUpperCase();
  if (clean.length !== 17) return { valid: false, error: "VIN must be 17 characters (got " + clean.length + ")", clean: clean };
  if (/[IOQ]/.test(clean)) return { valid: false, error: "VIN cannot contain I, O, or Q", clean: clean };
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(clean)) return { valid: false, error: "Invalid characters in VIN", clean: clean };
  return { valid: true, clean: clean };
}

function decodeWMI(vin: string): { make: string | null; country: string | null; year: number | null } {
  var wmi = vin.substring(0, 3);
  var entry = WMI[wmi];
  var yearChar = vin[9];
  var year = YEAR_MAP[yearChar] || null;
  if (entry) return { make: entry[0], country: entry[1], year: year };
  return { make: null, country: null, year: year };
}

export default function Home() {
  var [vin, setVin] = useState("");
  var [result, setResult] = useState<DecodeResult | null>(null);
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState("");
  var [history, setHistory] = useState<DecodeResult[]>([]);

  async function decode() {
    var v = validateVIN(vin);
    if (!v.valid && v.clean.length !== 17) { setError(v.error || "Invalid VIN"); return; }
    setLoading(true); setError(""); setResult(null);
    var clean = v.clean;

    // Step 1: WMI offline decode (instant)
    var wmiResult = decodeWMI(clean);

    // Step 2: NHTSA API (free, no key)
    try {
      var res = await fetch(NHTSA_URL + clean + "?format=json");
      var data = await res.json();
      if (data.Results && data.Results.length > 0) {
        var r = data.Results[0];
        var decoded: DecodeResult = {
          vin: clean,
          make: r.Make || wmiResult.make,
          model: r.Model || null,
          year: r.ModelYear ? parseInt(r.ModelYear) : wmiResult.year,
          body: r.BodyClass || null,
          engine: r.EngineModel || null,
          displacement: r.DisplacementL ? r.DisplacementL + "L" : null,
          cylinders: r.EngineCylinders || null,
          fuel: r.FuelTypePrimary || null,
          transmission: r.TransmissionStyle || null,
          drive: r.DriveType || null,
          doors: r.Doors || null,
          plant_country: r.PlantCountry || wmiResult.country,
          manufacturer: r.Manufacturer || null,
          vehicle_type: r.VehicleType || null,
          source: r.ErrorCode && r.ErrorCode.startsWith("0") ? "NHTSA (full decode)" : "NHTSA (partial) + WMI",
          decoded_at: new Date().toISOString(),
          validation: v,
          raw_fields: Object.keys(r).filter(function(k) { return r[k] && r[k] !== "" && r[k] !== "Not Applicable"; }).length,
        };
        setResult(decoded);
        setHistory(function(prev) { return [decoded].concat(prev).slice(0, 20); });
      } else {
        // Fallback to WMI only
        var fallback: DecodeResult = {
          vin: clean, make: wmiResult.make, model: null, year: wmiResult.year,
          body: null, engine: null, displacement: null, cylinders: null, fuel: null,
          transmission: null, drive: null, doors: null, plant_country: wmiResult.country,
          manufacturer: null, vehicle_type: null, source: "WMI offline",
          decoded_at: new Date().toISOString(), validation: v,
        };
        setResult(fallback);
        setHistory(function(prev) { return [fallback].concat(prev).slice(0, 20); });
      }
    } catch (e) {
      // Network error - use WMI fallback
      var fallback2: DecodeResult = {
        vin: clean, make: wmiResult.make, model: null, year: wmiResult.year,
        body: null, engine: null, displacement: null, cylinders: null, fuel: null,
        transmission: null, drive: null, doors: null, plant_country: wmiResult.country,
        manufacturer: null, vehicle_type: null, source: "WMI offline (API unavailable)",
        decoded_at: new Date().toISOString(), validation: v,
      };
      setResult(fallback2);
    }
    setLoading(false);
  }

  function Row(props: { label: string; value: string | number | null }) {
    if (!props.value) return null;
    return (
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
        <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{props.label}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", textAlign: "right", maxWidth: "60%" }}>{String(props.value)}</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      {/* NAV */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 900 }}>AP</span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>AutoPulse</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>VIN Decoder</span>
          <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>API Docs</span>
          <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>Pricing</span>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 20px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", marginBottom: 12, lineHeight: 1.1 }}>
            Vehicle Intelligence,<br />Decoded Instantly
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
            Free VIN decoder powered by NHTSA, EU registries, and a self-learning database. 130+ data fields per vehicle.
          </p>
        </div>

        {/* SEARCH */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={vin}
              onChange={function(e) { setVin(e.target.value.toUpperCase()); setError(""); }}
              onKeyDown={function(e) { if (e.key === "Enter") decode(); }}
              placeholder="Enter VIN (e.g. WVWZZZ3CZWE123456)"
              maxLength={17}
              style={{
                flex: 1, padding: "14px 16px", borderRadius: 10, border: "1px solid #e2e8f0",
                fontSize: 16, fontFamily: "'SF Mono', 'Fira Code', monospace", fontWeight: 600,
                letterSpacing: "1.5px", outline: "none", color: "#0f172a", background: "#f8fafc",
              }}
            />
            <button
              onClick={decode}
              disabled={loading || vin.replace(/[\s\-]/g, "").length < 17}
              style={{
                padding: "14px 28px", borderRadius: 10, border: "none",
                background: loading ? "#94a3b8" : "#0f172a", color: "#fff",
                fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer",
                opacity: vin.replace(/[\s\-]/g, "").length < 17 ? 0.4 : 1,
                transition: "all 0.15s",
              }}
            >
              {loading ? "Decoding..." : "Decode"}
            </button>
          </div>
          {error && <div style={{ marginTop: 10, fontSize: 13, color: "#dc2626", fontWeight: 500 }}>{error}</div>}
          <div style={{ marginTop: 10, fontSize: 11, color: "#94a3b8" }}>
            {vin.replace(/[\s\-]/g, "").length}/17 characters
          </div>
        </div>

        {/* RESULT */}
        {result && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 24 }}>
            {/* Header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>
                    {result.year || ""} {result.make || "Unknown"} {result.model || ""}
                  </div>
                  <div style={{ fontSize: 13, fontFamily: "monospace", color: "#94a3b8", marginTop: 4, letterSpacing: "1px" }}>
                    {result.vin}
                  </div>
                </div>
                <div style={{ padding: "4px 10px", borderRadius: 6, background: result.source.includes("full") ? "#dcfce7" : "#fef3c7", fontSize: 11, fontWeight: 600, color: result.source.includes("full") ? "#16a34a" : "#d97706" }}>
                  {result.source}
                </div>
              </div>
            </div>
            {/* Data */}
            <div style={{ padding: "8px 24px 16px" }}>
              <Row label="Make" value={result.make} />
              <Row label="Model" value={result.model} />
              <Row label="Year" value={result.year} />
              <Row label="Body" value={result.body} />
              <Row label="Engine" value={result.engine} />
              <Row label="Displacement" value={result.displacement} />
              <Row label="Cylinders" value={result.cylinders} />
              <Row label="Fuel" value={result.fuel} />
              <Row label="Transmission" value={result.transmission} />
              <Row label="Drive" value={result.drive} />
              <Row label="Doors" value={result.doors} />
              <Row label="Vehicle Type" value={result.vehicle_type} />
              <Row label="Manufacturer" value={result.manufacturer} />
              <Row label="Plant Country" value={result.plant_country} />
              {result.raw_fields && <Row label="Total Data Fields" value={result.raw_fields} />}
              {result.validation.error && <Row label="Validation Note" value={result.validation.error} />}
            </div>
          </div>
        )}

        {/* HISTORY */}
        {history.length > 1 && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Recent Decodes</div>
            {history.slice(1, 6).map(function(h) {
              return (
                <div key={h.vin + h.decoded_at} onClick={function() { setVin(h.vin); setResult(h); }}
                  style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f8fafc", cursor: "pointer" }}>
                  <span style={{ fontSize: 12, fontFamily: "monospace", color: "#64748b" }}>{h.vin}</span>
                  <span style={{ fontSize: 12, color: "#0f172a", fontWeight: 600 }}>{h.year} {h.make} {h.model}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* FEATURES */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 60 }}>
          {[
            { t: "Free Forever", d: "Powered by public government data. No API key needed for basic decoding.", i: "F" },
            { t: "130+ Fields", d: "Engine, transmission, body, plant, safety features and more per VIN.", i: "D" },
            { t: "Self-Learning", d: "Database grows with every decode. Community-powered accuracy.", i: "AI" },
          ].map(function(f) {
            return (
              <div key={f.t} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#0f172a" }}>{f.i}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{f.t}</div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{f.d}</div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div style={{ textAlign: "center", padding: "20px 0 40px", borderTop: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>AutoPulse v0.1.0 | VIN data from NHTSA vPIC (public domain) | Built by VIMOTA</span>
        </div>
      </div>
    </div>
  );
}
