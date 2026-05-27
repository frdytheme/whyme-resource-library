"use client";

import { useState } from "react";
import { GuideImageCarousel } from "@/components/GuideImageCarousel";

type GuideImage = {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
};

export type GuideImageGroup = {
  id: string;
  label: string;
  images: GuideImage[];
};

type GuideImageTabsProps = {
  groups: GuideImageGroup[];
};

export function GuideImageTabs({ groups }: GuideImageTabsProps) {
  const visibleGroups = groups.filter((group) => group.images.length > 0);
  const [activeGroupId, setActiveGroupId] = useState(visibleGroups[0]?.id ?? "");

  if (visibleGroups.length === 0) {
    return null;
  }

  const activeGroup =
    visibleGroups.find((group) => group.id === activeGroupId) ?? visibleGroups[0];

  if (visibleGroups.length === 1) {
    return <GuideImageCarousel images={activeGroup.images} />;
  }

  return (
    <section className="mb-0">
      <div className="mb-3 flex flex-wrap gap-2">
        {visibleGroups.map((group) => {
          const isActive = group.id === activeGroup.id;

          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setActiveGroupId(group.id)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-[#FF6B35] bg-[#FF6B35] text-white shadow-sm"
                  : "border-orange-100 bg-white text-stone-700 hover:border-[#FF6B35]"
              }`}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      <GuideImageCarousel key={activeGroup.id} images={activeGroup.images} />
    </section>
  );
}
