import Link from "next/link";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 32, showText = true, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      {/* Icon */}
      <div
        className="flex-shrink-0 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          boxShadow: "0 2px 8px rgba(79,70,229,0.4)",
        }}
      >
        <svg
          width={size * 0.65}
          height={size * 0.65}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* House silhouette */}
          <path
            d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1v-9.5z"
            fill="white"
            fillOpacity="0.9"
          />
          {/* Door */}
          <rect x="9.5" y="14" width="5" height="7" rx="0.5" fill="rgba(79,70,229,0.5)"/>
          {/* Trend line overlay */}
          <polyline
            points="5,17 8,13 11,15 15,10 19,12"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.85"
          />
          {/* Dot at peak */}
          <circle cx="15" cy="10" r="1.5" fill="white" />
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <span className="font-bold text-xl tracking-tight leading-none">
          <span className="text-indigo-600">Prop</span>
          <span className="text-slate-800">Vision</span>
        </span>
      )}
    </Link>
  );
}
