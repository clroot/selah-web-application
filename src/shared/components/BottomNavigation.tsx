"use client";

import { useState } from "react";

import { usePathname } from "next/navigation";

import { BookOpen, Check, Home, Settings } from "lucide-react";

import { CreateActionSheet } from "./CreateActionSheet";
import { FloatingActionButton } from "./FloatingActionButton";
import { NavItem } from "./NavItem";

const leftNavItems = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/prayers", icon: BookOpen, label: "기도문" },
];

const rightNavItems = [
  { href: "/prayer-topics?status=ANSWERED", icon: Check, label: "응답" },
  { href: "/settings", icon: Settings, label: "설정" },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href.split("?")[0]);
  };

  const handleFabClick = () => {
    setIsActionSheetOpen(true);
  };

  const handleActionSheetClose = () => {
    setIsActionSheetOpen(false);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-sand bg-white">
        <div className="relative mx-auto flex h-16 max-w-[480px] items-center justify-around">
          {leftNavItems.map((item) => (
            <NavItem key={item.href} {...item} isActive={isActive(item.href)} />
          ))}

          <FloatingActionButton onClick={handleFabClick} />

          {rightNavItems.map((item) => (
            <NavItem key={item.href} {...item} isActive={isActive(item.href)} />
          ))}
        </div>

        {/* Safe area padding for iOS */}
        <div className="h-[env(safe-area-inset-bottom,0px)] bg-white" />
      </nav>

      <CreateActionSheet
        isOpen={isActionSheetOpen}
        onClose={handleActionSheetClose}
      />
    </>
  );
}
