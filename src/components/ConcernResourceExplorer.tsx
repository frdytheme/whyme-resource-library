"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
  const [query, setQuery] = useState("");
  const selectedConcern = isConcernId(concernParam, concerns) ? concernParam : null;
  const activeConcern = concerns.find((concern) => concern.id === selectedConcern);
  const normalizedQuery = query.trim().toLowerCase();

  const visibleConcerns = useMemo(() => {
    if (!normalizedQuery) {
      return featuredConcernIds
        .map((id) => concerns.find((concern) => concern.id === id))
        .filter((concern): concern is Concern => Boolean(concern));
    }

    return concerns.filter((concern) => {
      const relatedResources = resources.filter((resource) =>
        resource.relatedConcerns.includes(concern.id),
      );
      return createConcernSearchText(concern, relatedResources).includes(normalizedQuery);
    });
  }, [concerns, normalizedQuery, resources]);

  const searchedResources = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return resources.filter((resource) =>
      createResourceSearchText(resource).includes(normalizedQuery),
    );
  }, [normalizedQuery, resources]);

  const recommendedResources = normalizedQuery
    ? searchedResources
    : activeConcern
      ? resources.filter((resource) => resource.relatedConcerns.includes(activeConcern.id))
      : resources.slice(0, 6);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
      <section>
        <div className="mb-4">
          <label htmlFor="concern-search" className="text-lg font-semibold text-stone-950">
            고민 검색
          </label>
          <input
            id="concern-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="예: 쇼츠, 현질, 디스코드, 댓글"
            className="mt-3 w-full rounded-lg border border-[#F59E0B]/45 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15"
          />
          <p className="mt-2 text-sm leading-6 text-stone-500">
            {normalizedQuery
              ? `${visibleConcerns.length}개의 관련 고민과 ${searchedResources.length}개의 자료를 찾았습니다.`
              : "자주 찾는 대표 질문을 먼저 보여드립니다."}
          </p>
        </div>

        <div className="grid gap-3">
          {visibleConcerns.map((concern) => {
            const isActive = concern.id === selectedConcern;

            return (
              <Link
                key={concern.id}
                href={`/concerns?concern=${concern.id}`}
                className={`rounded-lg border bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#FF6B35] hover:shadow-md ${
                  isActive ? "border-[#FF6B35] ring-2 ring-[#FF6B35]/15" : "border-orange-100"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm font-semibold leading-6 text-stone-950">{concern.title}</h3>
                  <span className="shrink-0 rounded-md bg-stone-100 px-2 py-1 text-xs text-stone-600">
                    {recommendedCount(resources, concern.id)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-600">{concern.description}</p>
              </Link>
            );
          })}
        </div>

        {visibleConcerns.length === 0 ? (
          <div className="rounded-lg border border-orange-100 bg-white p-5 text-sm leading-6 text-stone-600">
            검색된 고민이 없습니다. 오른쪽 자료 검색 결과를 확인하거나 다른 표현으로 검색해보세요.
          </div>
        ) : null}
      </section>

      <section>
        <div className="mb-4">
          <p className="text-sm font-medium text-[#0A7C6E]">
            {normalizedQuery ? "자료 검색 결과" : "추천 자료"}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-stone-950">
            {normalizedQuery
              ? `"${query.trim()}" 관련 자료`
              : activeConcern?.title ?? "대표 질문에서 시작해보세요"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            {normalizedQuery
              ? "검색어와 관련된 자료를 바로 확인할 수 있습니다."
              : activeConcern?.description ??
                "왼쪽에서 고민을 선택하면 그 상황에 맞는 설정 가이드와 대화 자료를 보여드립니다."}
          </p>
        </div>

        {recommendedResources.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {recommendedResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-orange-100 bg-white p-5 text-sm leading-6 text-stone-600">
            검색된 자료가 없습니다. 다른 표현으로 다시 검색해보세요.
          </div>
        )}
      </section>
    </div>
  );
}

function createConcernSearchText(concern: Concern, relatedResources: Resource[]) {
  return [
    concern.title,
    concern.description,
    ...concern.keywords,
    ...relatedResources.flatMap((resource) => [
      resource.title,
      resource.description,
      ...resource.tags,
      ...resource.keywords,
    ]),
  ]
    .join(" ")
    .toLowerCase();
}

function createResourceSearchText(resource: Resource) {
  return [
    resource.title,
    resource.description,
    ...resource.tags,
    ...resource.keywords,
  ]
    .join(" ")
    .toLowerCase();
}

function recommendedCount(resources: Resource[], concernId: ConcernId) {
  return resources.filter((resource) => resource.relatedConcerns.includes(concernId)).length;
}
