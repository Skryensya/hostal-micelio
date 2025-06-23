import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

// This would typically come from an environment variable
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin123" // Change this in production!

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please provide NEXTAUTH_SECRET environment variable")
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.username === ADMIN_USERNAME && 
            credentials?.password === ADMIN_PASSWORD) {
          return {
            id: "1",
            name: "Admin",
            email: "admin@hostal-micelio.com",
          }
        }
        return null
      }
    }),
    Google
  ],
  pages: {
    signIn: "/dashboard/login",
  },
})