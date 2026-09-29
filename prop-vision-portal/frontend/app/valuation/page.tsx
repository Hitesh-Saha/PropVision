"use client";

import { useEstimateMutation } from "@/hooks/useApi";
import ValuationForm from "@/components/valuation/ValuationForm";
import ValuationResult from "@/components/valuation/ValuationResult";
import BulkUpload from "@/components/valuation/BulkUpload";
import BulkResults from "@/components/valuation/BulkResults";
import { useState } from "react";
import {
  EstimateResponse,
  BulkEstimateResponse,
  PropertyFeatures,
} from "@/lib/schemas";
import AuthGuard from "@/components/AuthGuard";

function ValuationContent() {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [singleResult, setSingleResult] = useState<EstimateResponse | null>(
    null,
  );
  const [bulkResult, setBulkResult] = useState<BulkEstimateResponse | null>(
    null,
  );

  const estimateMutation = useEstimateMutation();

  const handleSingleEstimate = async (data: PropertyFeatures) => {
    try {
      const response = await estimateMutation.mutateAsync(data);
      setSingleResult(response);
      setActiveTab("single"); // Ensure we stay on single tab to show result
    } catch (err) {
      console.error("Estimation failed:", err);
    }
  };

  const handleBulkSuccess = (data: BulkEstimateResponse) => {
    setBulkResult(data);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Property Valuation
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Professional-grade estimates using advanced machine learning.
          </p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab("single")}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "single"
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            Single Estimate
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "bulk"
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            Bulk Upload
          </button>
        </div>
      </div>

      {bulkResult && activeTab === "bulk" ? (
        <BulkResults data={bulkResult} onClose={() => setBulkResult(null)} />
      ) : activeTab === "bulk" ? (
        <div className="max-w-2xl mx-auto py-10">
          <BulkUpload onSuccess={handleBulkSuccess} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2">
            <ValuationForm
              onSubmit={handleSingleEstimate}
              isLoading={estimateMutation.isPending}
            />
          </div>

          <div className="lg:col-span-1">
            {singleResult ? (
              <ValuationResult result={singleResult} />
            ) : (
              <div className="p-10 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-6 bg-slate-50/50">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-300 border shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-slate-700 text-lg">
                    Awaiting Estimation
                  </p>
                  <p className="text-sm text-slate-400 max-w-[240px] leading-relaxed">
                    Once you submit the form, your detailed market valuation
                    will appear here instantly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ValuationPage() {
  return (
    <AuthGuard>
      <ValuationContent />
    </AuthGuard>
  );
}
