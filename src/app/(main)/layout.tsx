import { BottomNav } from "@/components/shared/BottomNav";
import { PermissionPrompts } from "@/components/shared/PermissionPrompts";
import { SplashOverlay } from "@/components/shared/SplashOverlay";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh pb-16 pattern-dots">
      <SplashOverlay />
      {children}
      <BottomNav />
      <PermissionPrompts />
    </div>
  );
}
