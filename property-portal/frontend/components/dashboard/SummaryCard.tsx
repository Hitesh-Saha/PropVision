"use client";

interface SummaryCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

const SummaryCard = ({ label, value, icon }: SummaryCardProps) => (
  <div className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {icon && <div className="text-indigo-500">{icon}</div>}
    </div>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

export default SummaryCard;