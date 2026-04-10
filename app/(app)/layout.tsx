import BottomNav from "@/components/BottomNav";
import AccessibilityApplier from "@/components/AccessibilityApplier";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      <AccessibilityApplier />
      {/* pb-28 = 112px — spazio per la floating nav (72px) + margine (24px) + buffer */}
      <main className="flex-1 pb-28">{children}</main>
      <BottomNav />
    </div>
  );
}
