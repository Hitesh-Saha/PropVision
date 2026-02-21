"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MarketByBedrooms } from "@/lib/schemas";

interface AveragePriceChartProps {
  averageByBedrooms: MarketByBedrooms[];
}

export default function AveragePriceChart({ averageByBedrooms = []}: AveragePriceChartProps) {

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Average Price by Bedrooms</h3>
      {averageByBedrooms && averageByBedrooms.length > 0 ? (
        <div className="h-[300px] w-full" style={{ minHeight: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={averageByBedrooms}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="bedrooms" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                label={{ value: 'Number of Bedrooms', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                label={{
                  value: 'Price',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 3,
                }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Price"]}
              />
              <Bar dataKey="avg_price" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[300px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-lg">
          <p>No bedroom data available yet</p>
        </div>
      )}
    </div>
  );
}
