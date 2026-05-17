import Link from "next/link";
import { Zap } from "lucide-react";

const links = {
  Product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ],
  Students: [
    { label: "CBSE Class 11 & 12", href: "#" },
    { label: "JEE Preparation", href: "#" },
    { label: "NEET Preparation", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-black text-lg text-white">
                Stur<span className="text-indigo-400">evision</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              India&apos;s AI-powered revision engine for CBSE &amp; JEE students. Study less. Remember more.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-bold text-sm mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} Sturevision. Made with ❤️ for Indian students.
          </p>
          <p className="text-slate-600 text-sm">
            Powered by GPT-4o &nbsp;·&nbsp; Built in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
