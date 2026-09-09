"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Trophy,
  ClipboardList,
  Users,
  IndianRupee,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Tournament",
    href: "/dashboard/tournament",
    icon: Trophy,
  },
  {
    name: "Matches",
    href: "/dashboard/matches",
    icon: ClipboardList,
  },
  {
    name: "Players",
    href: "/dashboard/players",
    icon: Users,
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: IndianRupee,
  },
  {
    name: "Ledger",
    href: "/dashboard/ledger",
    icon: BookOpen,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-white border-r border-slate-200">
      
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <h1 className="text-lg font-bold text-slate-900">
          Financial Ledger
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={19} strokeWidth={2} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 px-3 text-sm font-medium text-slate-500">
          Admin
        </div>

        <button
          onClick={() => router.push("/login")}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}