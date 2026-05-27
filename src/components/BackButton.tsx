import Link from "next/link";

type BackButtonProps = {
  fallbackHref?: string;
};

export function BackButton({ fallbackHref = "/" }: BackButtonProps) {
  return (
    <Link
      href={fallbackHref}
      aria-label="뒤로 가기"
      title="뒤로 가기"
      className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-orange-100 bg-[#FAFAFA] text-stone-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#FF6B35] hover:bg-[#FFF4EE] hover:text-[#FF6B35] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/35 focus:ring-offset-2"
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
        <path d="m15 18-6-6 6-6" />
      </svg>
    </Link>
  );
}
