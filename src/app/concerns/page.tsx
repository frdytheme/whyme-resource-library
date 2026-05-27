import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ConcernResourceExplorer } from "@/components/ConcernResourceExplorer";
import { concerns } from "@/data/concerns";
import { resources } from "@/data/resources";

export const metadata: Metadata = {
  title: "고민별 자료 찾기",
  description: "학부모의 고민을 검색하고 WHYME 미디어 교육 자료를 추천받는 페이지입니다.",
};

export default function ConcernsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-stone-950">
      <section className="border-b border-orange-100 bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-medium text-[#0A7C6E] hover:text-[#075F54]">
            홈으로 돌아가기
          </Link>
          <div className="mt-6 max-w-2xl">
            <p className="text-sm font-medium text-[#0A7C6E]">무엇이 필요하신가요?</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-stone-950 sm:text-4xl">
              대표 질문에서 고르거나 검색해보세요
            </h1>
            <p className="mt-4 text-base leading-7 text-stone-600">
              자주 찾는 고민은 먼저 보여드리고, 더 구체적인 상황은 검색으로 찾을 수 있게 정리했습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <ConcernResourceExplorer concerns={concerns} resources={resources} />
        </Suspense>
      </section>
    </main>
  );
}
