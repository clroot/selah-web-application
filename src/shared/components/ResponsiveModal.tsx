"use client";

import * as React from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/shared/lib/utils";

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface ResponsiveModalContentProps {
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

interface ResponsiveModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveModalTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveModalDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveModalFooterProps {
  children: React.ReactNode;
  drawerClassName?: string;
  dialogClassName?: string;
}

interface ResponsiveModalCloseProps {
  children: React.ReactNode;
  asChild?: boolean;
}

function ResponsiveModal({
  open,
  onOpenChange,
  children,
}: ResponsiveModalProps) {
  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        {children}
      </Drawer>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {children}
      </Dialog>
    </>
  );
}

function ResponsiveModalContent({
  children,
  className,
  showCloseButton = false,
}: ResponsiveModalContentProps) {
  return (
    <>
      <DrawerContent className={cn("lg:hidden", className)}>
        {children}
      </DrawerContent>
      <DialogContent
        className={cn("hidden bg-cream lg:block", className)}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </>
  );
}

function ResponsiveModalHeader({
  children,
  className,
}: ResponsiveModalHeaderProps) {
  return (
    <>
      <DrawerHeader className={cn("lg:hidden", className)}>
        {children}
      </DrawerHeader>
      <DialogHeader className={cn("hidden lg:block", className)}>
        {children}
      </DialogHeader>
    </>
  );
}

function ResponsiveModalTitle({
  children,
  className,
}: ResponsiveModalTitleProps) {
  return (
    <>
      <DrawerTitle className={cn("lg:hidden", className)}>
        {children}
      </DrawerTitle>
      <DialogTitle className={cn("hidden lg:block", className)}>
        {children}
      </DialogTitle>
    </>
  );
}

function ResponsiveModalDescription({
  children,
  className,
}: ResponsiveModalDescriptionProps) {
  return (
    <>
      <DrawerDescription className={cn("lg:hidden", className)}>
        {children}
      </DrawerDescription>
      <DialogDescription className={cn("hidden lg:block", className)}>
        {children}
      </DialogDescription>
    </>
  );
}

function ResponsiveModalFooter({
  children,
  drawerClassName,
  dialogClassName,
}: ResponsiveModalFooterProps) {
  return (
    <>
      <DrawerFooter className={cn("lg:hidden", drawerClassName)}>
        {children}
      </DrawerFooter>
      <DialogFooter className={cn("hidden lg:flex", dialogClassName)}>
        {children}
      </DialogFooter>
    </>
  );
}

function ResponsiveModalClose({
  children,
  asChild,
}: ResponsiveModalCloseProps) {
  return (
    <>
      <DrawerClose asChild={asChild} className="lg:hidden">
        {children}
      </DrawerClose>
      <DialogClose asChild={asChild} className="hidden lg:block">
        {children}
      </DialogClose>
    </>
  );
}

export {
  ResponsiveModal,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
};
