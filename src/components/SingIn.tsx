import { signIn } from "@/lib/auth";

export function SignIn() {
  return (
    <form
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Signin with Google
      </button>
    </form>
  );
}
