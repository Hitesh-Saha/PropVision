"use client";

import { MarketSummary } from "@/lib/schemas";
import SummaryCard from "@/components/dashboard/SummaryCard";


interface SummarySectionProps {
  summary: MarketSummary;
}

export default function SummarySection({ summary }: SummarySectionProps) {
  const formatPrice = (price: number | null) => 
    price ? `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "N/A";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard 
        label="Total Estimates" 
        value={summary.total_estimates} 
      />
      <SummaryCard 
        label="Average Price" 
        value={formatPrice(summary.avg_price)} 
      />
      <SummaryCard 
        label="Minimum Price" 
        value={formatPrice(summary.min_price)} 
      />
      <SummaryCard 
        label="Maximum Price" 
        value={formatPrice(summary.max_price)} 
      />
    </div>
  );
}
