"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

/**
 * Wraps protected pages. Redirects to /login if the user is not authenticated.
 * Shows a loading spinner while the auth state is being rehydrated from localStorage.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200" />
          <div className="absolute top-0 w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
        </div>
        <p className="text-slate-500 font-medium animate-pulse">Authenticating…</p>
      </div>
    );
  }

  if (!user) {
    // Will redirect via the useEffect above; render nothing in the meantime
    return null;
  }

  return <>{children}</>;
}
