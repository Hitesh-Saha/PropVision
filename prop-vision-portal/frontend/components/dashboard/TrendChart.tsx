"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { HistoryItem } from "@/lib/schemas";

interface TrendChartProps {
  recentEstimates: HistoryItem[];
}

export default function TrendChart({ recentEstimates = [] }: TrendChartProps) {

  const trendData = (recentEstimates || []).map((e, idx) => ({
    index: idx + 1,
    price: e.price,
    date: new Date(e.created_at).toLocaleDateString(),
  }));

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Valuation Trends</h3>
      {trendData && trendData.length > 0 ? (
        <div className="h-[300px] w-full" style={{ minHeight: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="index" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                label={{ value: 'Number of Estimates', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                label={{ value: 'Price', position: 'insideLeft', angle: -90, offset: 3 }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Price"]}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#4f46e5" 
                strokeWidth={4} 
                dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[300px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-lg">
          <p>Waiting for more estimates to show trends</p>
        </div>
      )}
    </div>
  );
}
