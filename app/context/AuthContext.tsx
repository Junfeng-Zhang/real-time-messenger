"use client";

import { SessionProvider } from "next-auth/react";

// 这个 props 只接受子元素
export interface AuthContextProps {
  children: React.ReactNode;
}


export default function AuthContext({ children }: AuthContextProps) {
  return <SessionProvider>{children}</SessionProvider>;
}