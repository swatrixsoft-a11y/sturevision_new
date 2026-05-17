import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RegisterRedirect() {
  const { userId } = await auth();
  // Already logged in — go to dashboard
  if (userId) redirect("/dashboard");
  // Not logged in — go to the Clerk catch-all sign-up page
  redirect("/register/sign-up");
}
