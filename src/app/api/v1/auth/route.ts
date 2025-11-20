// src/app/api/v1/auth/route.ts

import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/services/userService";
import { signJwt } from "@/lib/security";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userid, password } = body;

  if (!userid || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  const user = await authenticateUser(userid, password);
  if (!user) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = signJwt({ sub: user.userid});
  
  return NextResponse.json(
    { access_token: token, token_type: "bearer" },
    { status: 200 }
  );
}