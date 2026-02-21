"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropertyFeatures, PropertyFeaturesSchema } from "@/lib/schemas";

interface ValuationFormProps {
  onSubmit: (data: PropertyFeatures) => void;
  isLoading: boolean;
}

export default function ValuationForm({ onSubmit, isLoading }: ValuationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFeatures>({
    resolver: zodResolver(PropertyFeaturesSchema),
    defaultValues: {
      square_footage: 0,
      bedrooms: 0,
      bathrooms: 0,
      year_built: new Date().getFullYear(),
      lot_size: 0,
      distance_to_city_center: 0,
      school_rating: 0,
    },
  });

  return (
    <form 
      onSubmit={handleSubmit((data) => onSubmit(data))} 
      className="space-y-8 bg-white p-8 border border-slate-200 rounded-2xl shadow-sm"
    >
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-slate-900 leading-tight">Property Features</h2>
        <p className="text-sm text-slate-500 mt-1">Provide accurate details for the best prediction.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">Square Footage</label>
          <div className="relative">
            <input
              type="number"
              step="1"
              {...register("square_footage", { valueAsNumber: true })}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all ${
                errors.square_footage ? "border-red-400" : "border-slate-200"
              }`}
              placeholder="e.g. 2000"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold uppercase">sq ft</span>
          </div>
          {errors.square_footage && <p className="text-red-500 text-xs font-medium">{errors.square_footage.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Bedrooms</label>
            <input
              type="number"
              step="1"
              {...register("bedrooms", { valueAsNumber: true })}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all ${
                errors.bedrooms ? "border-red-400" : "border-slate-200"
              }`}
            />
            {errors.bedrooms && <p className="text-red-500 text-xs font-medium">{errors.bedrooms.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Bathrooms</label>
            <input
              type="number"
              step="1"
              {...register("bathrooms", { valueAsNumber: true })}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all ${
                errors.bathrooms ? "border-red-400" : "border-slate-200"
              }`}
            />
            {errors.bathrooms && <p className="text-red-500 text-xs font-medium">{errors.bathrooms.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">Year Built</label>
          <input
            type="number"
            {...register("year_built", { valueAsNumber: true })}
            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all ${
              errors.year_built ? "border-red-400" : "border-slate-200"
            }`}
          />
          {errors.year_built && <p className="text-red-500 text-xs font-medium">{errors.year_built.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">Lot Size (sq ft)</label>
          <input
            type="number"
            {...register("lot_size", { valueAsNumber: true })}
            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all ${
              errors.lot_size ? "border-red-400" : "border-slate-200"
            }`}
          />
          {errors.lot_size && <p className="text-red-500 text-xs font-medium">{errors.lot_size.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">City Distance (miles)</label>
          <input
            type="number"
            step="0.1"
            {...register("distance_to_city_center", { valueAsNumber: true })}
            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all ${
              errors.distance_to_city_center ? "border-red-400" : "border-slate-200"
            }`}
          />
          {errors.distance_to_city_center && <p className="text-red-500 text-xs font-medium">{errors.distance_to_city_center.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">School Rating (1-10)</label>
          <input
            type="number"
            step="1"
            max="10"
            min="1"
            {...register("school_rating", { valueAsNumber: true })}
            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all ${
              errors.school_rating ? "border-red-400" : "border-slate-200"
            }`}
          />
          {errors.school_rating && <p className="text-red-500 text-xs font-medium">{errors.school_rating.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-lg shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Properties...
          </>
        ) : "Get Estimation"}
      </button>
    </form>
  );
}
