"use client";

import { useState } from "react";
import Link from "next/link";
import { TextProvider } from "../context/TextContext";
import { usePathname } from "next/navigation";

const pages = [
  { id: 1, name: "Medical Investigations" },
  // Add more pages here as needed
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <TextProvider>
      <div className="flex h-screen bg-gray-900">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white p-4">
          <h2 className="text-xl font-bold mb-4">Medical Record Pages</h2>
          <nav className="space-y-2">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/dashboard/page/${page.id}`}
                className={`block p-2 rounded transition-colors ${
                  pathname === `/dashboard/page/${page.id}`
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                {page.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </TextProvider>
  );
} 