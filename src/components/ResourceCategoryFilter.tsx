"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ResourceCard } from "@/components/ResourceCard";
import { Resource, ResourceCategory } from "@/types/resource";

const categoryOptions: {
  id: ResourceCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "platform_safety",
    label: "플랫폼 안전 설정",
    description: "서비스별 보호 설정과 노출 줄이기",
  },
  {
    id: "checklist_contract",
    label: "체크리스트·협약서",
    description: "가족 대화와 위험 신호 점검",
  },
  {
    id: "healthy_media_culture",
    label: "건강한 미디어 문화",
    description: "함께 고르고 해석하는 활동 자료",
  },
];

type ResourceCategoryFilterProps = {
  resources: Resource[];
};

function isCategory(value: string | null): value is ResourceCategory {
  return categoryOptions.some((category) => category.id === value);
}

export function ResourceCategoryFilter({ resources }: ResourceCategoryFilterProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const selectedCategory = isCategory(categoryParam) ? categoryParam : null;
  const filteredResources = selectedCategory
    ? resources.filter((resource) => resource.category === selectedCategory)
    : resources;

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
              className={`rounded-lg border bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#FF6B35] hover:shadow-md ${
                isActive ? "border-[#FF6B35] ring-2 ring-[#FF6B35]/15" : "border-orange-100"
              }`}
            >
              <p className="text-sm font-semibold text-stone-950">{category.label}</p>
              <p className="mt-1 text-sm text-stone-500">{count}개 자료</p>
              <p className="mt-2 text-xs leading-5 text-stone-500">{category.description}</p>
            </Link>
          );
        })}
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
