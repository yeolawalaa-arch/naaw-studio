import { NextRequest, NextResponse } from "next/server";
import { createUser } from "../../../lib/users";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) return NextResponse.json({ error: "All fields required" }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  try {
    const user = await createUser(name, email, password);
    return NextResponse.json({ success: true, name: user.name, email: user.email });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
