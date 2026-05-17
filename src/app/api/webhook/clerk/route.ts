import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

// Clerk webhook — auto-create MongoDB user on sign-up
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();

  let event: { type: string; data: any };
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as { type: string; data: any };
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "user.created") {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    await connectDB();

    await User.findOneAndUpdate(
      { clerkId: id },
      {
        $setOnInsert: {
          clerkId: id,
          name: `${first_name || ""} ${last_name || ""}`.trim() || "Student",
          email: email_addresses?.[0]?.email_address || "",
          avatar: image_url || "",
          referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  if (event.type === "user.deleted") {
    const { id } = event.data;
    await connectDB();
    await User.findOneAndDelete({ clerkId: id });
  }

  return NextResponse.json({ received: true });
}
