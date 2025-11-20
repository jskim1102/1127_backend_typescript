// src/lib/security.ts

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

import type { Secret, SignOptions } from "jsonwebtoken";

export function signJwt(payload: object) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  // expiresIn must be number (seconds) or a string like '1h', '60m', etc.
  // StringValue type: https://github.com/auth0/node-jsonwebtoken/blob/main/lib/ts-types.ts
  const expiresIn = process.env.JWT_EXPIRES_IN ?? "60m";
  const options: SignOptions = {
    expiresIn: expiresIn as any // force-cast to satisfy type, since env always returns string
  };
  return jwt.sign(payload, secret as Secret, options);
}