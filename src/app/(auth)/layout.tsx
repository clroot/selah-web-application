import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-cream px-4">
      <div className="mx-auto max-w-md">{children}</div>
    </div>
  );
}
