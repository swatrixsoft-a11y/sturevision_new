"use client";

import { useUser } from "@clerk/nextjs";

export default function UserGreeting() {
  const { user } = useUser();
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-black text-white">
        Welcome back, {user?.firstName || "Student"} 👋
      </h1>
      <p className="text-slate-500 mt-1">
        Ready to revise? Your AI memory engine is waiting.
      </p>
    </>
  );
}
