import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/register(.*)",
  "/api/webhook(.*)",
  "/api/payment/webhook(.*)",
  "/api/parse-pdf",
]);

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/upload(.*)",
  "/quiz(.*)",
  "/flashcards(.*)",
  "/scheduler(.*)",
  "/analytics(.*)",
  "/leaderboard(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");

  // Protected API routes → 401 instead of redirect (preserves POST body)
  if (isApi && !isPublicRoute(request) && !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Protected pages → Clerk handles redirect to /login (via NEXT_PUBLIC_CLERK_SIGN_IN_URL)
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
