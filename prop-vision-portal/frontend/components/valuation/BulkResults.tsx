"use client";

import { BulkEstimateResponse } from "@/lib/schemas";

interface BulkResultsProps {
  data: BulkEstimateResponse;
  onClose: () => void;
}

export default function BulkResults({ data, onClose }: BulkResultsProps) {
  const avgPrice = data.count > 0 
    ? data.items.reduce((acc, item) => acc + item.price, 0) / data.count 
    : 0;

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Bulk Estimation Results</h2>
          <p className="text-sm text-slate-500">Processed {data.count} properties successfully.</p>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
          <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-1">Average Price</p>
          <p className="text-2xl font-bold text-indigo-900">${Math.round(avgPrice).toLocaleString()}</p>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total properties</p>
          <p className="text-2xl font-bold text-slate-900">{data.count}</p>
        </div>
      </div>

      <div className="overflow-hidden border border-slate-100 rounded-xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Features</th>
              <th className="px-4 py-3 text-right">Estimated Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-900">#{idx + 1}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {item.features.square_footage} sq ft · {item.features.bedrooms} bed · {item.features.bathrooms} bath
                </td>
                <td className="px-4 py-3 text-right font-bold text-indigo-600">
                  ${Math.round(item.price).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
        >
          Close Results
        </button>
      </div>
    </div>
  );
}
