import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BackButton } from "@/components/BackButton";
import { ConcernResourceExplorer } from "@/components/ConcernResourceExplorer";
import { concerns } from "@/data/concerns";
import { visibleResources } from "@/data/visibleResources";

export const metadata: Metadata = {
  title: "고민별 자료 고르기",
  description: "상황에 가까운 고민을 고르고 WHYME 미디어 교육 자료를 추천받는 페이지입니다.",
};

export default function ConcernsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-stone-950">
      <section className="border-b border-orange-100 bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-medium text-[#0A7C6E] hover:text-[#075F54]">
            홈으로 돌아가기
          </Link>
          <div className="flex items-start justify-between gap-5">
            <div className="mt-6 max-w-2xl">
              <p className="text-sm font-medium text-[#0A7C6E]">무엇이 필요하신가요?</p>
              <h1 className="balanced-korean mt-2 text-3xl font-semibold leading-tight text-stone-950 sm:text-4xl">
                지금 상황과 가까운 고민을 골라보세요
              </h1>
              <p className="balanced-korean mt-4 text-base leading-7 text-stone-600">
                미디어와 관련된 상황을 둘러보고, 필요한 교육 자료를 추천받아보세요.
              </p>
            </div>
            <BackButton />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <ConcernResourceExplorer concerns={concerns} resources={visibleResources} />
        </Suspense>
      </section>
    </main>
  );
}
