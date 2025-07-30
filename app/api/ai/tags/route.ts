import { NextResponse } from "next/server";

export async function GET() {
  // Hardcoded mock response for now
  return NextResponse.json({
    tags: ["upbeat", "chill", "lo-fi"]
  });
}
