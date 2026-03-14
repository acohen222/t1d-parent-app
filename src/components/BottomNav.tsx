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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#B8D4EE] safe-area-pb">
      <div className="max-w-md mx-auto flex">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{ fontFamily: "var(--font-body)" }}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 text-xs transition-colors relative ${
                active
                  ? "text-[#1A5FA8] font-semibold"
                  : "text-[#5A8EB8] hover:text-[#2E7FD4]"
              }`}
            >
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full"
                  style={{ background: "var(--gradient-active)" }}
                />
              )}
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
