// lib/authorization.ts
import { cookies } from "next/headers";

export const verifySociety = async () => {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;
  return role === "society";
};

export const verifyOwner = async () => {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;
  return role === "owner";
};
