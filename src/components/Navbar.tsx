"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const isActiveLink = (path: string) => {
    return pathname === path ? "bg-blue-700" : "";
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              Crypto App
            </Link>

            <div className="flex space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActiveLink(
                  "/"
                )}`}
              >
                Dashboard
              </Link>
              <Link
                href="/convert"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActiveLink(
                  "/convert"
                )}`}
              >
                Convert
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
