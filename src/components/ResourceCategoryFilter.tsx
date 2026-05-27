"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ResourceCard } from "@/components/ResourceCard";
import { Resource, ResourceCategory } from "@/types/resource";

const categoryOptions: {
  id: ResourceCategory;
  label: string;
  description: string;
  activeClassName: string;
  accentClassName: string;
}[] = [
  {
    id: "platform_safety",
    label: "플랫폼 안전 설정",
    description: "서비스별 보호 설정과 노출 줄이기",
    activeClassName: "border-[#FF6B35] ring-2 ring-[#FF6B35]/15",
    accentClassName: "bg-[#FF6B35]",
  },
  {
    id: "checklist_contract",
    label: "체크리스트·협약서",
    description: "가족 대화와 위험 신호 점검",
    activeClassName: "border-[#0A7C6E] ring-2 ring-[#0A7C6E]/15",
    accentClassName: "bg-[#0A7C6E]",
  },
  {
    id: "healthy_media_culture",
    label: "건강한 미디어 문화",
    description: "함께 고르고 해석하는 활동 자료",
    activeClassName: "border-[#F59E0B] ring-2 ring-[#F59E0B]/20",
    accentClassName: "bg-[#F59E0B]",
  },
];

type ResourceCategoryFilterProps = {
  resources: Resource[];
};

function isCategory(value: string | null): value is ResourceCategory {
  return categoryOptions.some((category) => category.id === value);
}

export function ResourceCategoryFilter({ resources }: ResourceCategoryFilterProps) {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const selectedCategory = isCategory(categoryParam) ? categoryParam : null;
  const categoryResources = selectedCategory
    ? resources.filter((resource) => resource.category === selectedCategory)
    : resources;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredResources = useMemo(() => {
    const matchedResources = normalizedQuery
      ? categoryResources.filter((resource) =>
      [
        resource.title,
        resource.description,
        ...resource.keywords,
        ...resource.tags,
        ...resource.recommendedAge,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
      )
      : categoryResources;

    return [...matchedResources].sort((a, b) => {
      if (a.isRecommended === b.isRecommended) {
        return 0;
      }

      return a.isRecommended ? -1 : 1;
    });
  }, [categoryResources, normalizedQuery]);

  return (
    <>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/resources"
          className={`rounded-lg border bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#FF6B35] hover:shadow-md ${
            selectedCategory === null ? "border-[#FF6B35] ring-2 ring-[#FF6B35]/15" : "border-orange-100"
          }`}
        >
          <p className="text-sm font-semibold text-stone-950">전체</p>
          <p className="mt-1 text-sm text-stone-500">{resources.length}개 자료</p>
        </Link>

        {categoryOptions.map((category) => {
          const count = resources.filter((resource) => resource.category === category.id).length;
          const isActive = category.id === selectedCategory;

          return (
            <Link
              key={category.id}
              href={`/resources?category=${category.id}`}
              className={`rounded-lg border bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                isActive ? category.activeClassName : "border-orange-100 hover:border-[#FF6B35]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${category.accentClassName}`} />
                <p className="text-sm font-semibold text-stone-950">{category.label}</p>
              </div>
              <p className="mt-1 text-sm text-stone-500">{count}개 자료</p>
              <p className="mt-2 text-xs leading-5 text-stone-500">{category.description}</p>
            </Link>
          );
        })}
      </div>

      <div className="mb-6">
        <label htmlFor="resource-search" className="sr-only">
          전체 자료 검색
        </label>
        <input
          id="resource-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="자료명, 플랫폼, 상황 키워드로 검색해보세요"
          className="w-full rounded-lg border border-[#F59E0B]/45 bg-white px-4 py-3 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15"
        />
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-stone-950">자료 목록</h2>
        <span className="text-sm text-stone-500">{filteredResources.length}개</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </>
  );
}
