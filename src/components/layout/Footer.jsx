import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[hsl(0,0%,9%)] mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
              GrayOcean
            </span>
            <span className="text-gray-600 text-xs">© {new Date().getFullYear()}</span>
          </div>

          <nav className="flex items-center flex-wrap justify-center gap-5 text-xs text-gray-500">
            <Link to={createPageUrl("SSNLookup")} className="hover:text-gray-300 transition-colors">SSN Lookup</Link>
            <Link to={createPageUrl("AddressLookup")} className="hover:text-gray-300 transition-colors">Address Intel</Link>
            <Link to={createPageUrl("Skiptrace")} className="hover:text-gray-300 transition-colors">Skiptrace</Link>
            <Link to={createPageUrl("Forum")} className="hover:text-gray-300 transition-colors">Forum</Link>
            <Link to={createPageUrl("API")} className="hover:text-gray-300 transition-colors">API</Link>
          </nav>

          <div className="flex items-center gap-4 text-xs text-gray-600">
            <a href="mailto:support@grayocean.io" className="hover:text-gray-400 transition-colors">Contact</a>
            <span>·</span>
            <span className="text-gray-700">Privacy</span>
            <span>·</span>
            <span className="text-gray-700">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}