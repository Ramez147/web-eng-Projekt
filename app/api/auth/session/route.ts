import { NextResponse } from "next/server";
import { getSignedInUser } from "@/lib/loyalty/user-membership";

export async function GET() {
  try {
    const user = await getSignedInUser();

    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      userId: user.id,
      email: user.email ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}