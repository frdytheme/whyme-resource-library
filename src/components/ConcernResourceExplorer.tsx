"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ResourceCard } from "@/components/ResourceCard";
import { Concern, ConcernId, Resource } from "@/types/resource";

type ConcernResourceExplorerProps = {
  concerns: Concern[];
  resources: Resource[];
};

const featuredConcernIds: ConcernId[] = [
  "shorts_overuse",
  "sns_exposure",
  "stranger_contact",
  "game_conflict",
  "paid_game_spending",
  "content_quality",
];

function isConcernId(value: string | null, concerns: Concern[]): value is ConcernId {
  return concerns.some((concern) => concern.id === value);
}

export function ConcernResourceExplorer({ concerns, resources }: ConcernResourceExplorerProps) {
  const searchParams = useSearchParams();
  const concernParam = searchParams.get("concern");
  const selectedConcern = isConcernId(concernParam, concerns) ? concernParam : null;
  const activeConcern = concerns.find((concern) => concern.id === selectedConcern);
  const visibleConcerns = sortFeaturedFirst(concerns);

  const recommendedResources = activeConcern
    ? sortRecommendedFirst(
        resources.filter((resource) => resource.relatedConcerns.includes(activeConcern.id)),
      )
    : [];

  return (
    <>
      <section>
        <div className="mb-5 max-w-2xl">
          <h2 className="text-lg font-semibold text-stone-950">고민을 선택해보세요</h2>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            지금 가장 가까운 상황을 고르면, 바로 이어서 볼 만한 추천 자료를 모아 보여드립니다.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleConcerns.map((concern) => {
            const isActive = concern.id === selectedConcern;
            const count = recommendedCount(resources, concern.id);

            return (
              <Link
                key={concern.id}
                href={`/concerns?concern=${concern.id}`}
                className={`group flex min-h-[11rem] flex-col rounded-lg border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#FF6B35] hover:shadow-md ${
                  isActive ? "border-[#FF6B35] ring-2 ring-[#FF6B35]/15" : "border-orange-100"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-semibold leading-6 text-stone-950 group-hover:text-[#FF6B35]">
                    {concern.title}
                  </h3>
                  <span className="shrink-0 rounded-md bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                    {count}개
                  </span>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
                  {concern.description}
                </p>
                <span className="mt-auto pt-4 text-sm font-semibold text-[#0A7C6E]">
                  추천 자료 보기
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {activeConcern ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
          <Link
            href="/concerns"
            aria-label="추천 자료 닫기"
            className="absolute inset-0 bg-stone-950/55"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="concern-resource-modal-title"
            className="relative z-10 flex max-h-[min(44rem,calc(100vh-2rem))] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
          >
            <div className="border-b border-orange-100 px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#0A7C6E]">추천 자료</p>
                  <h2
                    id="concern-resource-modal-title"
                    className="mt-1 text-2xl font-semibold leading-tight text-stone-950"
                  >
                    {activeConcern.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                    {activeConcern.description}
                  </p>
                </div>
                <Link
                  href="/concerns"
                  aria-label="닫기"
                  className="flex size-9 shrink-0 items-center justify-center rounded-md border border-stone-200 text-xl leading-none text-stone-500 transition hover:border-[#FF6B35] hover:text-[#FF6B35]"
                >
                  ×
                </Link>
              </div>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              {recommendedResources.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendedResources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      href={`/resources/${resource.id}?from=concerns&concern=${activeConcern.id}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-orange-100 bg-white p-5 text-sm leading-6 text-stone-600">
                  이 고민과 연결된 자료가 아직 없습니다.
                </div>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function sortFeaturedFirst(concerns: Concern[]) {
  return [...concerns].sort((a, b) => {
    const aIndex = featuredConcernIds.indexOf(a.id);
    const bIndex = featuredConcernIds.indexOf(b.id);
    const aFeatured = aIndex !== -1;
    const bFeatured = bIndex !== -1;

    if (aFeatured && bFeatured) {
      return aIndex - bIndex;
    }

    if (aFeatured !== bFeatured) {
      return aFeatured ? -1 : 1;
    }

    return 0;
  });
}

function recommendedCount(resources: Resource[], concernId: ConcernId) {
  return resources.filter((resource) => resource.relatedConcerns.includes(concernId)).length;
}

function sortRecommendedFirst(resources: Resource[]) {
  return [...resources].sort((a, b) => {
    if (a.isRecommended === b.isRecommended) {
      return 0;
    }

    return a.isRecommended ? -1 : 1;
  });
}
