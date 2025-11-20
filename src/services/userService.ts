// src/services/userService.ts

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/security";
import { UserCreate } from "@/types/user";

export async function getUserByEmail(userid: string) {
  return await prisma.user.findUnique({ where: { userid } });
}

export async function createUser(user: UserCreate) {
  const hashedPassword = await hashPassword(user.password);
  return await prisma.user.create({
    data: {
      userid: user.userid,
      name: user.name,
      phoneNumber: user.phoneNumber,
      role: user.role || "CUSTOMER",
      rtsp: user.rtsp,
      hashedPassword,
    },
  });
}

export async function authenticateUser(userid: string, password: string) {
  const user = await getUserByEmail(userid);
  if (!user) return null;

  const isValid = await verifyPassword(password, user.hashedPassword);
  if (!isValid) return null;

  return user;
}