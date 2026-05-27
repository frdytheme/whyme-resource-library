import Link from "next/link";
import { Resource } from "@/types/resource";

const categoryLabels: Record<Resource["category"], string> = {
  platform_safety: "플랫폼 안전 설정",
  checklist_contract: "체크리스트·협약서",
  healthy_media_culture: "건강한 미디어 문화",
};

const difficultyLabels: Record<Resource["difficulty"], string> = {
  easy: "쉬움",
  normal: "보통",
  advanced: "심화",
};

type ResourceCardProps = {
  resource: Resource;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Link
      href={`/resources/${resource.id}`}
      className="group flex h-full flex-col rounded-lg border border-orange-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#FF6B35] hover:shadow-md"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="rounded-md bg-[#FF6B35]/10 px-2.5 py-1 text-xs font-medium text-[#FF6B35]">
          {categoryLabels[resource.category]}
        </span>
      </div>

      <h3 className="text-base font-semibold leading-6 text-stone-950 group-hover:text-[#FF6B35]">
        {resource.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">
        {resource.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {resource.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-[#F59E0B]/35 px-2 py-1 text-xs text-stone-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-stone-500">
        <span>{difficultyLabels[resource.difficulty]}</span>
        <span className="text-right">{resource.recommendedAge.join(" · ")}</span>
      </div>
    </Link>
  );
}
