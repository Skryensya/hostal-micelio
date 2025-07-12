import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  // const session = await auth();
  
  // Check if the request is for the dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // if (!session && !request.nextUrl.pathname.endsWith("/login")) {
    //   // If there is no session and not trying to access login page, redirect to login
    //   const loginUrl = new URL("/dashboard/login", request.url);
    //   return NextResponse.redirect(loginUrl);
    // }
    
    // Temporarily allow all dashboard access
    console.log("Auth disabled - allowing dashboard access");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
}; 