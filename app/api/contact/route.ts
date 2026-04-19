import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "../../../lib/loyalty/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const message = String(body?.message ?? "").trim();
    const inquiryType = String(body?.inquiryType ?? "").trim() || null;
    const responseWindow = String(body?.responseWindow ?? "").trim() || null;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, E-Mail und Nachricht sind erforderlich." },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabaseClient();
    const userAgent = request.headers.get("user-agent");
    const { error } = await supabase.from("contact_requests").insert({
      name,
      email,
      message,
      inquiry_type: inquiryType,
      response_window: responseWindow,
      source_path: new URL(request.url).pathname,
      user_agent: userAgent,
    });

    if (error) {
      console.error("[contact] Failed to store message", error);
      return NextResponse.json(
        { error: "Die Nachricht konnte nicht gespeichert werden." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Danke, deine Nachricht wurde erfolgreich übermittelt.",
    });
  } catch {
    return NextResponse.json(
      { error: "Die Nachricht konnte nicht verarbeitet werden." },
      { status: 500 }
    );
  }
}