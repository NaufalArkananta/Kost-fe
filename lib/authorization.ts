// lib/authorization.ts
import { cookies } from "next/headers";

export const verifySociety = () => {
  const role = cookies().get("role")?.value;
  return role === "society";
};

export const verifyOwner = () => {
  const role = cookies().get("role")?.value;
  return role === "owner";
};
