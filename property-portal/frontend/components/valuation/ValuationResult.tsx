"use client";

import { EstimateResponse } from "@/lib/schemas";

interface ValuationResultProps {
  result: EstimateResponse;
}

export default function ValuationResult({ result }: ValuationResultProps) {
  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-semibold mb-6">Estimate Result</h2>
      <div className="space-y-6">
        <div className="bg-indigo-50 p-6 rounded-lg text-center">
          <p className="text-sm text-indigo-600 font-medium uppercase tracking-wider mb-2">Estimated Market Price</p>
          <p className="text-4xl font-bold text-indigo-900">
            ${result.price.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        
        <div className="pt-4 text-center">
          <div className="p-3 bg-slate-50 rounded inline-block min-w-[200px]">
            <p className="text-xs text-slate-500 uppercase tracking-tight">Created At</p>
            <p className="text-sm font-medium">{new Date(result.created_at).toLocaleDateString()} at {new Date(result.created_at).toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-slate-900 mb-3">Property Summary</h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-slate-500">Square Footage:</div>
            <div className="text-right font-medium">{result.features.square_footage.toLocaleString()} sq ft</div>
            
            <div className="text-slate-500">Bedrooms:</div>
            <div className="text-right font-medium">{result.features.bedrooms}</div>
            
            <div className="text-slate-500">Bathrooms:</div>
            <div className="text-right font-medium">{result.features.bathrooms}</div>
            
            <div className="text-slate-500">Year Built:</div>
            <div className="text-right font-medium">{result.features.year_built}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
