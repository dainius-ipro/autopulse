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
  engine_power_kw: number | null;
  engine_power_hp: number | null;
  engine_kw: string | null;
  series: string | null;
  variant: string | null;
  version: string | null;
  weight_kg: number | null;
  seats: number | null;
  type_approval: string | null;
  chassis_code: string | null;
  baumuster: string | null;
  source: string;
  sources_used: number;
  confidence: number;
  decoded_at: string;
  cached: boolean;
  raw_fields: number;
  validation: { valid: boolean; error?: string };
  [key: string]: any;
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
      if (data.error && res.status >= 400) { setError(data.error); }
      else {
        setDecodeTime(Date.now() - start);
        setResult(data);
        setHistory(function(prev) { return [data].concat(prev.filter(function(h: DecodeResult) { return h.vin !== data.vin; })).slice(0, 20); });
      }
    } catch (e) { setError("Network error - please try again"); }
    setLoading(false);
  }

  function Row(props: { label: string; value: string | number | null | undefined }) {
    if (!props.value && props.value !== 0) return null;
    return (
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
        <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{props.label}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", textAlign: "right", maxWidth: "60%" }}>{String(props.value)}</span>
      </div>
    );
  }

  function confColor(c: number) {
    if (c >= 70) return "#16a34a";
    if (c >= 40) return "#d97706";
    return "#dc2626";
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
            Multi-source VIN decoder: NHTSA + EU Registry + Manufacturer patterns + DynamoDB cache.
          </p>
        </div>

        {/* SEARCH */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={vin}
              onChange={function(e) { setVin(e.target.value.toUpperCase()); setError(""); }}
              onKeyDown={function(e) { if (e.key === "Enter") decode(); }}
              placeholder="Enter VIN (e.g. SB1KA3BE00E019980)"
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
            {/* Header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>
                    {result.year || ""} {result.make || "Unknown"} {result.model || ""}
                  </div>
                  {result.trim && <div style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>{result.trim}</div>}
                  <div style={{ fontSize: 13, fontFamily: "monospace", color: "#94a3b8", marginTop: 4, letterSpacing: "1px" }}>{result.vin}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  {/* Confidence */}
                  {result.confidence !== undefined && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 60, height: 6, borderRadius: 3, background: "#f1f5f9", overflow: "hidden" }}>
                        <div style={{ width: result.confidence + "%", height: "100%", borderRadius: 3, background: confColor(result.confidence) }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: confColor(result.confidence) }}>{result.confidence}%</span>
                    </div>
                  )}
                  {/* Sources */}
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {result.cached && <span style={{ padding: "3px 7px", borderRadius: 5, background: "#dbeafe", fontSize: 9, fontWeight: 700, color: "#2563eb" }}>CACHED</span>}
                    {(result.source || "").split(" + ").map(function(s: string) {
                      var colors: Record<string, string[]> = {
                        "nhtsa": ["#dcfce7", "#16a34a"], "nhtsa_partial": ["#fef3c7", "#d97706"],
                        "wmi": ["#e0e7ff", "#4f46e5"], "manufacturer_decode": ["#fce7f3", "#db2777"],
                        "rdw_nl": ["#fff7ed", "#ea580c"], "cache": ["#dbeafe", "#2563eb"],
                      };
                      var c = colors[s] || ["#f1f5f9", "#64748b"];
                      return <span key={s} style={{ padding: "3px 7px", borderRadius: 5, background: c[0], fontSize: 9, fontWeight: 700, color: c[1] }}>{s.toUpperCase()}</span>;
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Data sections */}
            <div style={{ padding: "8px 24px 4px" }}>
              {/* Identity */}
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", padding: "12px 0 4px" }}>Vehicle Identity</div>
              <Row label="Make" value={result.make} />
              <Row label="Model" value={result.model} />
              <Row label="Year" value={result.year} />
              <Row label="Trim" value={result.trim} />
              <Row label="Series" value={result.series} />
              <Row label="Variant" value={result.variant} />
              <Row label="Version" value={result.version} />
              <Row label="Vehicle Type" value={result.vehicle_type} />

              {/* Engine & Drivetrain */}
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", padding: "16px 0 4px" }}>Engine & Drivetrain</div>
              <Row label="Engine" value={result.engine} />
              <Row label="Displacement" value={result.displacement} />
              <Row label="Cylinders" value={result.cylinders} />
              <Row label="Power (HP)" value={result.engine_power_hp || result.horsepower} />
              <Row label="Power (kW)" value={result.engine_power_kw || result.engine_kw} />
              <Row label="Fuel" value={result.fuel} />
              <Row label="Transmission" value={result.transmission} />
              <Row label="Drive" value={result.drive} />

              {/* Body & Specs */}
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", padding: "16px 0 4px" }}>Body & Specifications</div>
              <Row label="Body" value={result.body} />
              <Row label="Doors" value={result.doors} />
              <Row label="Seats" value={result.seats} />
              <Row label="Weight" value={result.weight_kg ? result.weight_kg + " kg" : null} />

              {/* Manufacturing */}
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", padding: "16px 0 4px" }}>Manufacturing</div>
              <Row label="Manufacturer" value={result.manufacturer} />
              <Row label="Plant Country" value={result.plant_country} />
              <Row label="Plant City" value={result.plant_city} />
              <Row label="Type Approval" value={result.type_approval} />
              <Row label="Chassis Code" value={result.chassis_code} />

              {/* Meta */}
              {(result.raw_fields || 0) > 0 && (
                <>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", padding: "16px 0 4px" }}>Decode Info</div>
                  <Row label="NHTSA Raw Fields" value={result.raw_fields} />
                  <Row label="Sources Used" value={result.sources_used} />
                  {result.validation && result.validation.error && <Row label="Validation" value={result.validation.error} />}
                </>
              )}
            </div>

            {/* API Link */}
            <div style={{ padding: "12px 24px", borderTop: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>API: </span>
                <a href={"/api/vin/" + result.vin} target="_blank" style={{ fontSize: 11, color: "#2563eb", fontFamily: "monospace" }}>/api/vin/{result.vin}</a>
              </div>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{result.confidence}% confidence | {result.sources_used} sources</span>
            </div>
          </div>
        )}

        {/* HISTORY */}
        {history.length > 0 && !result && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Recent Decodes</div>
            {history.slice(0, 8).map(function(h: DecodeResult) {
              return (
                <div key={h.vin + h.decoded_at} onClick={function() { setVin(h.vin); setResult(h); }}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f8fafc", cursor: "pointer" }}>
                  <span style={{ fontSize: 12, fontFamily: "monospace", color: "#64748b" }}>{h.vin}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#0f172a", fontWeight: 600 }}>{h.year} {h.make} {h.model}</span>
                    {h.confidence !== undefined && <span style={{ fontSize: 10, fontWeight: 700, color: confColor(h.confidence) }}>{h.confidence}%</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FEATURES */}
        {!result && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 60 }}>
            {[
              { t: "Multi-Source", d: "NHTSA + EU Registry (RDW) + Manufacturer VIN patterns + DynamoDB cache. Up to 4 sources per decode.", i: "4x" },
              { t: "EU Vehicles", d: "European-spec vehicles decoded via RDW Netherlands open data and manufacturer-specific VIN logic.", i: "EU" },
              { t: "Confidence Score", d: "Each decode shows a confidence percentage based on how many fields were filled from available sources.", i: "%" },
              { t: "Self-Learning", d: "Every decode is cached. Database grows with each lookup. Community-powered accuracy over time.", i: "AI" },
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
          <span style={{ fontSize: 12, color: "#94a3b8" }}>AutoPulse v0.3.0 | Sources: NHTSA vPIC + RDW NL + Manufacturer Decoders + DynamoDB | Built by VIMOTA</span>
        </div>
      </div>
    </div>
  );
}
