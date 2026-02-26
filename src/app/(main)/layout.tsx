import { BottomNav } from "@/components/shared/BottomNav";
import { PermissionPrompts } from "@/components/shared/PermissionPrompts";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh pb-20 pattern-dots">
      {children}
      <BottomNav />
      <PermissionPrompts />
    </div>
  );
}
