"use client";

import { useHistory, useMarketData } from "@/hooks/useApi";
import RecentActivity from "@/components/dashboard/RecentActivity";
import SummarySection from "@/components/dashboard/SummarySection";
import AveragePriceChart from "@/components/dashboard/AveragePriceChart";
import TrendChart from "@/components/dashboard/TrendChart";

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useMarketData();
  const { data: historyData } = useHistory();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200"></div>
          <div className="absolute top-0 w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 font-medium animate-pulse">Loading market insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-red-50 border border-red-100 rounded-xl text-center">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3 className="text-lg font-bold text-red-900 mb-2">Failed to load data</h3>
        <p className="text-red-700 text-sm mb-6">{error instanceof Error ? error.message : "An unexpected error occurred"}</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Market Intelligence</h1>
          <p className="text-slate-500 mt-1">Real-time property market trends and valuation history.</p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <SummarySection summary={data.summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AveragePriceChart averageByBedrooms={data.by_bedrooms} />
        <TrendChart recentEstimates={historyData?.items || []} />
      </div>

      <div>
        <RecentActivity history={historyData?.items || []} />
      </div>
    </div>
  );
}
