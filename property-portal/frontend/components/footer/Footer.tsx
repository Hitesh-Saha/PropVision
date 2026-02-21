export default function Footer() {
    return (
        <footer className="border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-4 text-sm text-slate-500">
            © {new Date().getFullYear()} Property Portal
          </div>
        </footer>
    );
}   