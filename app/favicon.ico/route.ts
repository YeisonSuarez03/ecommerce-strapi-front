import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Redirect to the API favicon route
  return NextResponse.redirect(new URL("/api/favicon", request.url));
} 