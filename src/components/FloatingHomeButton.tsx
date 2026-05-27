"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingHomeButton() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <Link
      href="/"
      aria-label="홈으로 돌아가기"
      title="홈으로 돌아가기"
      className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#FF6B35]/25 bg-white text-[#FF6B35] shadow-lg shadow-stone-900/10 transition duration-200 hover:-translate-y-0.5 hover:border-[#FF6B35] hover:bg-[#FFF4EE] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/35 focus:ring-offset-2 sm:bottom-6 sm:right-6"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    </Link>
  );
}
