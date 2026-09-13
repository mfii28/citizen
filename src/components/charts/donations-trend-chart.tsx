"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export function DonationsTrendChart({ data }: { data: { month: string; raised: number; spent: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#DCEFF5" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value: number) => `GHS ${value.toLocaleString()}`} />
        <Legend />
        <Bar dataKey="raised" name="Raised" fill="#1E8AA8" radius={[4, 4, 0, 0]} />
        <Bar dataKey="spent" name="Spent" fill="#E8A233" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
