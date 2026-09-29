"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-5 max-w-2xl">
        {/* Logo mark */}
        <div className="flex justify-center mb-2">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1v-9.5z" fill="white" fillOpacity="0.9"/>
              <rect x="9.5" y="14" width="5" height="7" rx="0.5" fill="rgba(79,70,229,0.5)"/>
              <polyline points="5,17 8,13 11,15 15,10 19,12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85"/>
              <circle cx="15" cy="10" r="1.5" fill="white"/>
            </svg>
          </div>
        </div>

        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            <span className="text-indigo-600">Prop</span>Vision
          </h1>
          <p className="text-lg text-slate-500 font-medium mt-1">Property Valuation Platform</p>
        </div>
        <p className="text-lg text-slate-600 leading-relaxed">
          Get precise property estimates powered by machine learning and explore real-time market trends.
        </p>

        {!user && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/register"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-200"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 border border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 font-semibold rounded-xl transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link
          href={user ? "/valuation" : "/login"}
          className="group p-8 bg-white border rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col items-start space-y-4"
        >
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Valuation Tool</h2>
            <p className="text-slate-500">Calculate property value based on size, location, and features using our AI model.</p>
          </div>
        </Link>

        <Link
          href={user ? "/dashboard" : "/login"}
          className="group p-8 bg-white border rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col items-start space-y-4"
        >
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Market Dashboard</h2>
            <p className="text-slate-500">Analyze market trends, average prices by bedroom count, and historical request data.</p>
          </div>
        </Link>
      </div>

      {/* ML info card */}
      <div className="w-full max-w-5xl bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border border-indigo-100">
        <div className="flex-1 space-y-4">
          <h3 className="text-2xl font-bold text-slate-900">Powered by Machine Learning</h3>
          <p className="text-slate-600">
            Our estimation engine uses a Ridge Regression model trained on thousands of property records to deliver accurate, feature-weighted results in milliseconds.
          </p>
          <div className="flex gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Real-time Analysis
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Historical Insights
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <div className="w-2 h-2 rounded-full bg-violet-500"></div>
              Persistent Storage
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm border rotate-3 hover:rotate-0 transition-transform duration-500">
           <div className="space-y-2">
             <div className="w-32 h-4 bg-slate-100 rounded"></div>
             <div className="w-24 h-4 bg-indigo-100 rounded"></div>
             <div className="w-40 h-8 bg-indigo-600 rounded mt-4"></div>
           </div>
        </div>
      </div>
    </div>
  );
}
