import Link from "next/link";

export default function Header() {
    return (
        <header className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-primary-600">
              Property Portal
            </Link>
            <nav className="space-x-4">
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/valuation" className="hover:underline">
                Valuation
              </Link>
            </nav>
          </div>
        </header>
    );
}