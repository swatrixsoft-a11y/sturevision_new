import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models/Message";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room") || "general";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const before = searchParams.get("before");

  await connectDB();

  const query: Record<string, unknown> = { room };
  if (before) query.createdAt = { $lt: new Date(before) };

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json({ messages: messages.reverse() });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { room, content, type = "text", attachmentData } = body;

  if (!room || !content?.trim()) {
    return NextResponse.json({ error: "Missing room or content" }, { status: 400 });
  }

  const clerkUser = await currentUser();
  const name =
    clerkUser?.fullName ||
    clerkUser?.username ||
    clerkUser?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "Student";
  const avatar = clerkUser?.imageUrl;

  await connectDB();

  const message = await Message.create({
    room,
    sender: { userId, name, avatar },
    content: content.trim().slice(0, 2000),
    type,
    ...(attachmentData ? { attachmentData } : {}),
  });

  return NextResponse.json(message.toObject());
}
