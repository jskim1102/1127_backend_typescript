// src/types/user.ts

export interface UserCreate {
  userid: string;
  password: string;
  name: string;
  phoneNumber: string;
  rtsp: string;
  role?: 'ADMIN' | 'CUSTOMER';
}