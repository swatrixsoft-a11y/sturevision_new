import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already handles redirecting unauthenticated users.
  // Do NOT add redirect("/login") here — it causes an infinite loop with Clerk v6
  // when auth() returns null during token refresh while the middleware passes.
  const { userId } = await auth();

  let streak = 0;

  if (userId) {
    try {
      await connectDB();

      let dbUser = await User.findOne({ clerkId: userId }).select("streakCount").lean() as { streakCount?: number } | null;

      if (!dbUser) {
        const clerkUser = await currentUser();
        if (clerkUser) {
          dbUser = await User.findOneAndUpdate(
            { clerkId: userId },
            {
              $setOnInsert: {
                clerkId: userId,
                name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Student",
                email: clerkUser.emailAddresses[0]?.emailAddress || "",
                avatar: clerkUser.imageUrl || "",
                referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
              },
            },
            { upsert: true, setDefaultsOnInsert: true, new: true }
          ).select("streakCount").lean() as { streakCount?: number } | null;
        }
      }

      streak = (dbUser as any)?.streakCount ?? 0;
    } catch (err) {
      console.error("Dashboard layout DB error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-[#080b14] flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <DashboardTopbar streak={streak} />
        <main className="flex-1 p-4 pb-28 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
