import { NextResponse } from "next/server";
import backupData from "../../../Data/etfTrackerBackup.json";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  return NextResponse.json(backupData);
}
