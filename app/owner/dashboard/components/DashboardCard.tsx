"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
}

export function DashboardCard({ title, value, icon, color }: DashboardCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color ?? "text-indigo-600"}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
