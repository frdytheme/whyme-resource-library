import type { Metadata } from "next";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";
import { PackageCollection } from "@/components/PackageCollection";
import { packages } from "@/data/packages";
import { visibleResources } from "@/data/visibleResources";

export const metadata: Metadata = {
  title: "미디어 환경설정 패키지",
  description: "학부모가 자주 마주치는 상황별로 WHYME 미디어 교육 자료를 묶어 안내합니다.",
};

export default function PackagesPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-stone-950">
      <section className="border-b border-orange-100 bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-medium text-[#0A7C6E] hover:text-[#075F54]">
            홈으로 돌아가기
          </Link>
          <div className="flex items-start justify-between gap-5">
            <div className="mt-6 max-w-2xl">
              <p className="text-sm font-medium text-[#0A7C6E]">상황별 추천 설정 모음</p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight text-stone-950 sm:text-4xl">
                지금 꼭 필요한 설정을 확인하세요
              </h1>
              <p className="mt-4 text-base leading-7 text-stone-600">
                일상에서 자주 마주할 수 있는 상황별로 필요한 가이드 자료를 묶어서 안내해 드릴게요.
              </p>
            </div>
            <BackButton />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
        <PackageCollection packages={packages} resources={visibleResources} />
      </section>
    </main>
  );
}
