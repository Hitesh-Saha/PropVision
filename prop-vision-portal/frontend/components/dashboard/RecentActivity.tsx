"use client";

import { useState } from "react";
import { HistoryItem } from "@/lib/schemas";

interface RecentActivityProps {
  history: HistoryItem[];
}

export default function RecentActivity({ history = [] }: RecentActivityProps) {
  const [filterBedrooms, setFilterBedrooms] = useState<number | null>(null);

  const safeHistory = history || [];

  const bedOptions = Array.from(new Set(safeHistory.map((e) => e.features.bedrooms)))
    .sort((a, b) => a - b);

  const filteredHistory = filterBedrooms !== null
    ? safeHistory.filter((e) => e.features.bedrooms === filterBedrooms)
    : safeHistory;

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Filter by Beds:</span>
          <select
            value={filterBedrooms ?? ""}
            onChange={(e) => setFilterBedrooms(e.target.value === "" ? null : parseFloat(e.target.value))}
            className="text-sm border rounded-md px-3 py-1.5 focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="">All Bedrooms</option>
            {bedOptions.map((beds) => (
              <option key={beds} value={beds}>
                {beds} {beds === 1 ? "Bedroom" : "Bedrooms"}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-medium">
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Estimated Price</th>
              <th className="px-6 py-4 text-left">Details</th>
              <th className="px-6 py-4 text-right">School</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredHistory.map((history) => (
              <tr key={history.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-medium text-slate-900">
                    {new Date(history.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(history.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-base font-bold text-indigo-600">
                    ${history.price.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">
                      {history.features.square_footage.toLocaleString()} sqft
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">
                      {history.features.bedrooms} beds
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">
                      {history.features.bathrooms} baths
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    history.features.school_rating >= 8 ? 'bg-green-100 text-green-700' :
                    history.features.school_rating >= 5 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {history.features.school_rating.toFixed(1)}/10
                  </span>
                </td>
              </tr>
            ))}
            {filteredHistory.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  No estimates found matching the filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
