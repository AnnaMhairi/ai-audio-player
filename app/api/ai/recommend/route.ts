import { NextResponse } from "next/server";

export async function GET() {
  // Pick a fake recommendation (could use random logic)
  return NextResponse.json({
    recommendedTrackId: "2", // matches an id in tracks.json
    message: "We think you'll like Ocean Breeze next!"
  });
}
