"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-24 space-y-12">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
          Modern Property <span className="text-indigo-600">Valuation</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Get precise property estimates powered by machine learning and explore real-time market trends.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link 
          href="/valuation" 
          className="group p-8 bg-white border rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col items-start space-y-4"
        >
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/></svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Valuation Tool</h2>
            <p className="text-slate-500">Calculate property value based on size, location, and features using our AI model.</p>
          </div>
        </Link>

        <Link 
          href="/dashboard" 
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

      <div className="w-full max-w-5xl bg-slate-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border">
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
