"use client";
import { useState } from "react";

interface DecodeResult {
  vin: string;
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
  horsepower: string | null;
  series: string | null;
  source: string;
  decoded_at: string;
  cached: boolean;
  raw_fields: number;
  validation: { valid: boolean; error?: string };
}

export default function Home() {
  var [vin, setVin] = useState("");
  var [result, setResult] = useState<DecodeResult | null>(null);
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState("");
  var [history, setHistory] = useState<DecodeResult[]>([]);
  var [decodeTime, setDecodeTime] = useState(0);

  async function decode() {
    var clean = vin.replace(/[\s\-]/g, "").toUpperCase();
    if (clean.length !== 17) { setError("VIN must be exactly 17 characters"); return; }
    setLoading(true); setError(""); setResult(null);
    var start = Date.now();
    try {
      var res = await fetch("/api/vin/" + clean);
      var data = await res.json();
      if (data.error && res.status >= 400) {
        setError(data.error);
      } else {
        setDecodeTime(Date.now() - start);
        setResult(data);
        setHistory(function(prev) { return [data].concat(prev.filter(function(h) { return h.vin !== data.vin; })).slice(0, 20); });
      }
    } catch (e) {
      setError("Network error - please try again");
    }
    setLoading(false);
  }

  function Row(props: { label: string; value: string | number | null | undefined }) {
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
          <span style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", background: "#f1f5f9", padding: "2px 6px", borderRadius: 4 }}>BETA</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <span style={{ fontSize: 13, color: "#0f172a", fontWeight: 600 }}>VIN Decoder</span>
          <a href="/api/vin/WVWZZZ3CZWE123456" style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>API Demo</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 20px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", marginBottom: 12, lineHeight: 1.1 }}>
            Vehicle Intelligence,<br />Decoded Instantly
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
            Free VIN decoder with DynamoDB caching, NHTSA integration, and self-learning database. 130+ data fields per vehicle.
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
          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>{vin.replace(/[\s\-]/g, "").length}/17 characters</span>
            {result && <span style={{ fontSize: 11, color: "#94a3b8" }}>{decodeTime}ms {result.cached ? "(cached)" : ""}</span>}
          </div>
        </div>

        {/* RESULT */}
        {result && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 24 }}>
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
                <div style={{ display: "flex", gap: 6 }}>
                  {result.cached && <span style={{ padding: "4px 8px", borderRadius: 6, background: "#dbeafe", fontSize: 10, fontWeight: 600, color: "#2563eb" }}>CACHED</span>}
                  <span style={{ padding: "4px 10px", borderRadius: 6, background: result.source === "nhtsa" ? "#dcfce7" : result.source === "cache" ? "#dbeafe" : "#fef3c7", fontSize: 10, fontWeight: 600, color: result.source === "nhtsa" ? "#16a34a" : result.source === "cache" ? "#2563eb" : "#d97706" }}>
                    {result.source.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ padding: "8px 24px 16px" }}>
              <Row label="Make" value={result.make} />
              <Row label="Model" value={result.model} />
              <Row label="Year" value={result.year} />
              <Row label="Trim" value={result.trim} />
              <Row label="Series" value={result.series} />
              <Row label="Body" value={result.body} />
              <Row label="Engine" value={result.engine} />
              <Row label="Displacement" value={result.displacement} />
              <Row label="Cylinders" value={result.cylinders} />
              <Row label="Horsepower" value={result.horsepower} />
              <Row label="Fuel" value={result.fuel} />
              <Row label="Transmission" value={result.transmission} />
              <Row label="Drive" value={result.drive} />
              <Row label="Doors" value={result.doors} />
              <Row label="Vehicle Type" value={result.vehicle_type} />
              <Row label="Manufacturer" value={result.manufacturer} />
              <Row label="Plant Country" value={result.plant_country} />
              <Row label="Plant City" value={result.plant_city} />
              {result.raw_fields > 0 && <Row label="Total Data Fields" value={result.raw_fields} />}
              {result.validation && result.validation.error && <Row label="Validation Note" value={result.validation.error} />}
            </div>
            {/* API Link */}
            <div style={{ padding: "12px 24px", borderTop: "1px solid #f1f5f9", background: "#f8fafc" }}>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>API: </span>
              <a href={"/api/vin/" + result.vin} target="_blank" style={{ fontSize: 11, color: "#2563eb", fontFamily: "monospace" }}>
                /api/vin/{result.vin}
              </a>
            </div>
          </div>
        )}

        {/* HISTORY */}
        {history.length > 0 && !result && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Recent Decodes</div>
            {history.slice(0, 8).map(function(h) {
              return (
                <div key={h.vin + h.decoded_at} onClick={function() { setVin(h.vin); setResult(h); }}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f8fafc", cursor: "pointer" }}>
                  <span style={{ fontSize: 12, fontFamily: "monospace", color: "#64748b" }}>{h.vin}</span>
                  <span style={{ fontSize: 12, color: "#0f172a", fontWeight: 600 }}>{h.year} {h.make} {h.model}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* FEATURES */}
        {!result && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 60 }}>
            {[
              { t: "Free API", d: "RESTful API with JSON responses. GET /api/vin/{vin} for instant decode.", i: "{}" },
              { t: "DynamoDB Cache", d: "First decode hits NHTSA. Subsequent lookups served from cache in <50ms.", i: "DB" },
              { t: "Batch Decode", d: "POST /api/vin/batch with up to 50 VINs. Perfect for fleet operations.", i: "50" },
            ].map(function(f) {
              return (
                <div key={f.t} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#0f172a", fontFamily: "monospace" }}>{f.i}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{f.t}</div>
                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{f.d}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* FOOTER */}
        <div style={{ textAlign: "center", padding: "20px 0 40px", borderTop: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>AutoPulse v0.2.0 | VIN data: NHTSA vPIC (public domain) + DynamoDB cache | Built by VIMOTA</span>
        </div>
      </div>
    </div>
  );
}
