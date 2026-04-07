"use client";

import DashboardNav from "./DashboardNav";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardNav />
      <div className="lg:ml-56 min-h-screen">
        {/* Mobile top padding for fixed nav */}
        <div className="lg:hidden h-14" />
        {children}
      </div>
    </>
  );
}
