"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatGHS } from "@/lib/utils";

const COLORS = ["#1E8AA8", "#E8A233", "#3D9A6C", "#7FC8DA"];

export function FundAllocationChart({ data }: { data: { name: string; value: number }[] }) {
  if (data.every((d) => d.value === 0)) {
    return <p className="flex h-64 items-center justify-center text-sm text-ocean-600 dark:text-ocean-400">No expenditure recorded yet.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => formatGHS(value)}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #146D8A",
            backgroundColor: "#081D26",
            color: "#EFF8FB",
            fontSize: "12px",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
