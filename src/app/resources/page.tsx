import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BackButton } from "@/components/BackButton";
import { ResourceCategoryFilter } from "@/components/ResourceCategoryFilter";
import { visibleResources } from "@/data/visibleResources";

export const metadata: Metadata = {
  title: "전체 자료",
  description: "WHYME 미디어 교육 자료집의 전체 자료 목록입니다.",
};

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-stone-950">
      <section className="border-b border-orange-100 bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-medium text-[#0A7C6E] hover:text-[#075F54]">
            홈으로 돌아가기
          </Link>
          <div className="flex items-start justify-between gap-5">
            <div className="mt-6 max-w-2xl">
              <p className="text-sm font-medium text-[#0A7C6E]">전체 자료 보기</p>
              <h1 className="balanced-korean mt-2 text-3xl font-semibold leading-tight text-stone-950 sm:text-4xl">
                필요한 자료를 카테고리로 찾아보세요
              </h1>
              <p className="balanced-korean mt-4 text-base leading-7 text-stone-600">
                플랫폼 안전 설정, 체크리스트·협약서, 건강한 미디어 문화 자료를 한곳에 모았습니다.
              </p>
            </div>
            <BackButton />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <ResourceCategoryFilter resources={visibleResources} />
        </Suspense>
      </section>
    </main>
  );
}
