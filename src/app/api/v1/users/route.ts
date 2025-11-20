import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/services/userService"; // 사용자 관련 서비스 함수
import { UserCreate } from "@/types/user"; // 사용자 생성 시 필요한 데이터 타입


export async function POST(req: NextRequest) {
  const body = await req.json(); // request의 body에서 JSON 데이터를 비동기적 parsing
  const { userid, password, name, phoneNumber, role , rtsp} = body as UserCreate; // 회원가입에 필요한 field 정보 추출

  if (!userid || !password || !name || !phoneNumber || !rtsp) { // 필수 field 정보가 모두 입력되었는지 확인
    return NextResponse.json(
      { message: "모든 필드를 입력해 주세요." },
      { status: 400 }
    );
  }

  const existing = await getUserByEmail(userid); // 중복된 이메일 검사
  if (existing) {
    return NextResponse.json(
      { message: "이미 등록된 아이디입니다." },
      { status: 400 }
    );
  }

  const user = await createUser({ userid, password, name, phoneNumber, role, rtsp}); // 모든 유효성 검사 완료 이후 회원가입
  const { hashedPassword, ...userWithoutPassword } = user; // 클라이언트에게 반환하는 정보 중 비밀번호 해시값은 제외
  return NextResponse.json(userWithoutPassword, { status: 201 });
}