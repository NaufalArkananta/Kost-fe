import { ReactNode } from "react";
import OwnerSidebar from "./components/OwnerSidebar";

export default function OwnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
