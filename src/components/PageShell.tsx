import BottomNav from "./BottomNav";

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

export default function PageShell({ title, subtitle, children, headerRight }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 px-4 pt-12 pb-4 safe-area-pt">
        <div className="max-w-md mx-auto flex items-end justify-between">
          <div>
            <h1 className="text-xl font-bold text-stone-800">{title}</h1>
            {subtitle && (
              <p className="text-sm text-stone-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>
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
