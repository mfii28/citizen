"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { formatGHS } from "@/lib/utils";

export function DonationsTrendChart({ data }: { data: { month: string; raised: number; spent: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="stroke-ocean-100 dark:stroke-ocean-800/80" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          stroke="currentColor"
          className="text-ocean-600 dark:text-ocean-400"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          stroke="currentColor"
          className="text-ocean-600 dark:text-ocean-400"
          tickFormatter={(v) => `${v}`}
        />
        <Tooltip
          formatter={(value: number) => formatGHS(value)}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #146D8A",
            backgroundColor: "#081D26",
            color: "#EFF8FB",
            fontSize: "12px",
          }}
          labelStyle={{ color: "#7FC8DA", fontWeight: 600 }}
        />
        <Legend />
        <Bar dataKey="raised" name="Raised" fill="#1E8AA8" radius={[4, 4, 0, 0]} />
        <Bar dataKey="spent" name="Spent" fill="#E8A233" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
