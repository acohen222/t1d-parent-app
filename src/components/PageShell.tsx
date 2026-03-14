import BottomNav from "./BottomNav";

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

export default function PageShell({ title, subtitle, children, headerRight }: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-frost)" }}>
      {/* Header */}
      <header className="bg-white border-b border-[#B8D4EE] px-4 pt-12 pb-4 safe-area-pt shadow-[0_2px_12px_rgba(26,95,168,0.06)] relative">
        <div className="max-w-md mx-auto flex items-end justify-between">
          <div>
            <h1
              className="text-xl font-extrabold text-[#1A3A5C]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-[#5A8EB8] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                {subtitle}
              </p>
            )}
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>
        {/* Gradient accent bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{ background: "var(--gradient-header)" }}
        />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
