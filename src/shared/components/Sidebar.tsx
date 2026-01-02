"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BookOpen,
  CheckCircle,
  FileText,
  Home,
  Plus,
  Settings,
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: typeof Home;
  label: string;
  isActive: boolean;
}

function SidebarNavItem({ href, icon: Icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-sand text-deep-brown"
          : "text-soft-brown hover:bg-sand/50 hover:text-deep-brown"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}

function SidebarActionButton({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Plus;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex w-full items-center gap-3 rounded-lg bg-deep-brown px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-soft-brown"
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-sand lg:bg-cream">
      <div className="flex h-16 items-center border-b border-sand px-6">
        <h1 className="font-serif text-xl font-bold text-deep-brown">Selah</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <SidebarNavItem
          href="/"
          icon={Home}
          label="홈"
          isActive={isActive("/")}
        />
        <SidebarNavItem
          href="/prayer-topics"
          icon={CheckCircle}
          label="기도제목"
          isActive={isActive("/prayer-topics")}
        />
        <SidebarNavItem
          href="/prayers"
          icon={BookOpen}
          label="기도문"
          isActive={isActive("/prayers")}
        />

        <div className="py-2">
          <div className="h-px bg-sand" />
        </div>

        <div className="space-y-2">
          <SidebarActionButton
            href="/prayer-topics/new"
            icon={Plus}
            label="새 기도제목"
          />
          <SidebarActionButton
            href="/prayers/new"
            icon={FileText}
            label="새 기도문"
          />
        </div>
      </nav>

      <div className="border-t border-sand p-3">
        <SidebarNavItem
          href="/settings"
          icon={Settings}
          label="설정"
          isActive={isActive("/settings")}
        />
      </div>
    </aside>
  );
}
