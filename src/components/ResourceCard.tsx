import Link from "next/link";
import { Resource } from "@/types/resource";

const categoryLabels: Record<Resource["category"], string> = {
  platform_safety: "플랫폼 안전 설정",
  checklist_contract: "체크리스트·협약서",
  healthy_media_culture: "건강한 미디어 문화",
};

const categoryBadgeStyles: Record<Resource["category"], string> = {
  platform_safety: "bg-[#FF6B35]/10 text-[#FF6B35]",
  checklist_contract: "bg-[#0A7C6E]/10 text-[#0A7C6E]",
  healthy_media_culture: "bg-[#F59E0B]/15 text-[#B86600]",
};

const recommendedCardStyles: Record<Resource["category"], string> = {
  platform_safety: "border-[#FF6B35]/45 bg-[#FFF4EE] ring-[#FF6B35]/10 hover:border-[#FF6B35]",
  checklist_contract: "border-[#0A7C6E]/40 bg-[#EFFAF7] ring-[#0A7C6E]/10 hover:border-[#0A7C6E]",
  healthy_media_culture: "border-[#F59E0B]/45 bg-[#FFF8E8] ring-[#F59E0B]/15 hover:border-[#F59E0B]",
};

const recommendedBadgeStyles: Record<Resource["category"], string> = {
  platform_safety: "text-[#FF6B35]",
  checklist_contract: "text-[#0A7C6E]",
  healthy_media_culture: "text-[#B86600]",
};

type ResourceCardProps = {
  resource: Resource;
  href?: string;
};

export function ResourceCard({ resource, href = `/resources/${resource.id}` }: ResourceCardProps) {
  return (
    <Link
      href={href}
      className={`group flex h-full flex-col rounded-lg border p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${
        resource.isRecommended
          ? `ring-1 ${recommendedCardStyles[resource.category]}`
          : "border-orange-100 bg-white hover:border-[#FF6B35]"
      }`}
    >
      <div className="mb-3 flex min-h-7 flex-wrap items-center gap-2">
        <span
          className={`rounded-md px-2.5 py-1 text-xs font-medium ${categoryBadgeStyles[resource.category]}`}
        >
          {categoryLabels[resource.category]}
        </span>
        {resource.isRecommended ? (
          <span
            className={`rounded-md bg-white px-2.5 py-1 text-xs font-semibold shadow-sm ${recommendedBadgeStyles[resource.category]}`}
          >
            추천
          </span>
        ) : null}
      </div>

      <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-stone-950 group-hover:text-[#FF6B35]">
        {resource.title}
      </h3>
      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-stone-600">
        {resource.description}
      </p>

      <div className="mt-4 flex min-h-7 flex-wrap gap-1.5">
        {resource.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-[#F59E0B]/35 px-2 py-1 text-xs text-stone-600"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-1" />
    </Link>
  );
}
