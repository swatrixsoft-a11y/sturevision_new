import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  // Sync user to MongoDB on first login (only calls currentUser() when user doesn't exist)
  await connectDB();
  const exists = await User.exists({ clerkId: userId });
  if (!exists) {
    const clerkUser = await currentUser();
    if (clerkUser) {
      await User.findOneAndUpdate(
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
        { upsert: true, setDefaultsOnInsert: true }
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#080b14] flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <DashboardTopbar />
        <main className="flex-1 p-4 pb-28 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
