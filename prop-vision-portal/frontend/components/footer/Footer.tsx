import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Logo size={24} />
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} PropVision · AI-Powered Property Valuation
        </p>
      </div>
    </footer>
  );
}