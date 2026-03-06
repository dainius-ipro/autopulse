import { NextRequest, NextResponse } from "next/server";
import { getWmi } from "@/lib/dynamo";
import { WMI_DB } from "@/lib/wmi";

export async function GET(request: NextRequest, { params }: { params: Promise<{ wmi: string }> }) {
  var { wmi } = await params;
  wmi = wmi.toUpperCase().replace(/[^A-Z0-9]/g, "");

  if (wmi.length < 2 || wmi.length > 3) {
    return NextResponse.json({ error: "WMI must be 2-3 characters" }, { status: 400 });
  }

  // 1. Check offline DB first (instant)
  var offline = WMI_DB[wmi];
  if (offline) {
    return NextResponse.json({
      wmi: wmi,
      make: offline.make,
      country: offline.country,
      type: offline.type || "Passenger",
      source: "wmi_offline",
    });
  }

  // 2. Check DynamoDB for extended WMI data
  var dynamo = await getWmi(wmi);
  if (dynamo) {
    return NextResponse.json({
      ...dynamo,
      source: "wmi_database",
    });
  }

  // 3. Try partial match (first 2 chars)
  var partial = null;
  for (var key in WMI_DB) {
    if (key.substring(0, 2) === wmi.substring(0, 2)) {
      partial = { wmi: wmi, make: WMI_DB[key].make, country: WMI_DB[key].country, type: WMI_DB[key].type || "Passenger", source: "wmi_partial" };
      break;
    }
  }

  if (partial) {
    return NextResponse.json(partial);
  }

  return NextResponse.json({ wmi: wmi, make: null, country: null, source: "unknown", error: "WMI not found" }, { status: 404 });
}
