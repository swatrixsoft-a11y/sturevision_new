import { NextRequest, NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 413 });
  }

  try {
    const buffer = await file.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. Try a text-based (not scanned) PDF." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text: text.slice(0, 20000) });
  } catch {
    return NextResponse.json(
      { error: "Failed to parse PDF. Make sure it is a valid, text-based PDF." },
      { status: 422 }
    );
  }
}
