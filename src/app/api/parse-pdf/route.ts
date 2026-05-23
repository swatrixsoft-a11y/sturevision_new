import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const data = await pdfParse(buffer);

  if (!data.text?.trim()) {
    return NextResponse.json({ error: "Could not extract text from PDF. Try a text-based PDF." }, { status: 422 });
  }

  return NextResponse.json({ text: data.text });
}
