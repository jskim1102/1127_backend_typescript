// src/app/api/v1/users/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/services/userService";
import { UserCreate } from "@/types/user";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userid, password, name, phoneNumber, role, rtsp } = body as UserCreate;

  if (!userid || !password || !name || !phoneNumber || !rtsp) {
    return NextResponse.json(
      { message: "모든 필드를 입력해 주세요." },
      { status: 400 }
    );
  }

  const existing = await getUserByEmail(userid);
  if (existing) {
    return NextResponse.json(
      { message: "이미 등록된 아이디입니다." },
      { status: 400 }
    );
  }

  const user = await createUser({ userid, password, name, phoneNumber, role, rtsp });
  const { hashedPassword, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword, { status: 201 });
}