"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TextProvider } from "../context/TextContext";

const pages = [
  { path: "/dashboard/medical-investigations", name: "Medical Investigations" },
  { path: "/dashboard/progress-notes", name: "Daily Progress Notes" },
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
                key={page.path}
                href={page.path}
                className={`block p-2 rounded transition-colors ${
                  pathname === page.path
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