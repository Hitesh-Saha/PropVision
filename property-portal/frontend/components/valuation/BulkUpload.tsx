"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import { BulkEstimateResponse, PropertyFeatures } from "@/lib/schemas";
import { useBulkEstimateMutation } from "@/hooks/useApi";

interface BulkUploadProps {
  onSuccess: (results: BulkEstimateResponse) => void;
}

export default function BulkUpload({ onSuccess }: BulkUploadProps) {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkMutation = useBulkEstimateMutation();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsParsing(true);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsParsing(false);
        const rawData = results.data as Record<string, unknown>[];
        
        console.debug("Papa Parse Raw Data:", rawData);

        // Validate and transform data
        const featuresList: PropertyFeatures[] = [];
        const errors: string[] = [];

        rawData.forEach((row, index) => {
          try {
            // Find keys case-insensitively and handle spaces/underscores/BOM
            const findValue = (possibleNames: string[]) => {
              const key = Object.keys(row).find(k => {
                const cleanKey = k.toLowerCase().replace(/[^\w]/g, '');
                return possibleNames.some(name => {
                  const cleanName = name.toLowerCase().replace(/[^\w]/g, '');
                  return cleanKey === cleanName;
                });
              });
              return key ? row[key] : undefined;
            };

            const features: PropertyFeatures = {
              square_footage: Number(findValue(["square_footage", "sqft", "sq_ft", "square footage", "living_area"])) || 0,
              bedrooms: Number(findValue(["bedrooms", "beds", "bedroom", "bed"])) || 0,
              bathrooms: Number(findValue(["bathrooms", "baths", "bathroom", "bath"])) || 0,
              year_built: Number(findValue(["year_built", "year", "year built"])) || 2000,
              lot_size: Number(findValue(["lot_size", "lot", "lot size"])) || 5000,
              distance_to_city_center: Number(findValue(["distance_to_city_center", "distance", "city_distance", "distance to city center"])) || 5,
              school_rating: Number(findValue(["school_rating", "school", "school_rating", "school rating"])) || 5,
            };

            console.debug(`Row ${index + 1} features:`, features);

            // Basic validation
            if (features.square_footage <= 0) throw new Error("Square footage must be > 0 or could not find header.");
            
            featuresList.push(features);
          } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            console.warn(`Row ${index + 1} error:`, message);
            errors.push(`Row ${index + 1}: ${message}`);
          }
        });

        if (errors.length > 0) {
          setError(`Found errors in CSV (first 3):\n${errors.slice(0, 3).join("\n")}`);
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        if (featuresList.length === 0) {
          setError("No valid properties found in CSV. Please check headers.");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        // Send to API
        bulkMutation.mutate(featuresList, {
          onSuccess: (data: BulkEstimateResponse) => {
            onSuccess(data);
            if (fileInputRef.current) fileInputRef.current.value = "";
          },
          onError: (err: Error) => {
            setError(err.message || "Failed to process bulk estimation.");
            if (fileInputRef.current) fileInputRef.current.value = "";
          }
        });
      },
      error: (err: Error) => {
        setIsParsing(false);
        setError(`Failed to parse CSV: ${err.message}`);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  };

  const handleDownloadSample = () => {
    const headers = "square_footage,bedrooms,bathrooms,year_built,lot_size,distance_to_city_center,school_rating";
    const sample = ["1850,3,2,1998,7500,5.6,8.2", "2200,4,3,2005,8000,3.2,9.1"];
    const csvContent = [headers, ...sample].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'property_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Bulk Estimation</h2>
          <p className="text-sm text-slate-500">Upload a CSV file with property features.</p>
        </div>
        <div className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-medium border border-indigo-100">
          CSV format supported
        </div>
      </div>

      <div className="space-y-4">
        <input 
          id="bulk-csv-upload"
          type="file" 
          accept=".csv" 
          className="hidden" 
          onChange={handleFileUpload}
          disabled={bulkMutation.isPending || isParsing}
          ref={fileInputRef}
        />
        <label 
          htmlFor="bulk-csv-upload"
          className={`
            relative group cursor-pointer border-2 border-dashed rounded-xl p-8
            flex flex-col items-center justify-center transition-all
            ${bulkMutation.isPending || isParsing ? 'bg-slate-50 border-slate-200 cursor-not-allowed' : 'bg-slate-50/50 border-slate-200 hover:border-indigo-400 hover:bg-white'}
          `}
        >
          
          {(bulkMutation.isPending || isParsing) ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-slate-600">Processing Properties...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border shadow-sm group-hover:scale-110 transition-transform mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <p className="text-sm font-semibold text-slate-900 text-center">Click to upload or drag and drop</p>
              <p className="text-[11px] text-slate-500 mt-2 text-center max-w-xs leading-relaxed">
                Requires headers: <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">square_footage</span>, <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">bedrooms</span>, <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">bathrooms</span>...
              </p>
            </>
          )}
        </label>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700 whitespace-pre-line">
            <div className="flex gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-bold px-1">
          <span>Max 100 properties</span>
          <button 
            type="button"
            className="text-indigo-600 hover:text-indigo-700 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              handleDownloadSample();
            }}
          >
            Download Sample
          </button>
        </div>
      </div>
    </div>
  );
}
