"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Sidebar navigation with simple links.
 * Animates on mount for a smooth entrance.
 */
export default function Sidebar() {
  const navItems = [
    { name: "Home", href: "#" },
    { name: "Search", href: "#" },
    { name: "Library", href: "#" },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden sm:block bg-brand-dark p-4 text-white w-60"
    >
      <nav className="space-y-4">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href} className="block hover:text-brand">
            {item.name}
          </Link>
        ))}
      </nav>
    </motion.aside>
  );
}
