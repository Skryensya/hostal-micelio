// import { handlers } from "@/lib/auth" // Referring to the auth.ts we just created
// export const { GET, POST } = handlers

// Temporary disabled auth routes
export async function GET() {
  return new Response(JSON.stringify({ error: "Auth disabled" }), {
    status: 501,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST() {
  return new Response(JSON.stringify({ error: "Auth disabled" }), {
    status: 501,
    headers: { "Content-Type": "application/json" },
  });
}