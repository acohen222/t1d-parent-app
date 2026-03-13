"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, ClipboardList, BarChart2, BookOpen } from "lucide-react";

const nav = [
  { href: "/",        icon: Home,          label: "Home" },
  { href: "/ask",     icon: MessageCircle, label: "Ask Why" },
  { href: "/log",     icon: ClipboardList, label: "Log" },
  { href: "/insights",icon: BarChart2,     label: "Insights" },
  { href: "/guide",   icon: BookOpen,      label: "Guide" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 safe-area-pb">
      <div className="max-w-md mx-auto flex">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 text-xs transition-colors ${
                active
                  ? "text-[#4a7c59] font-semibold"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              <Icon
                size={22}
                className={active ? "stroke-[2.2]" : "stroke-[1.5]"}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
