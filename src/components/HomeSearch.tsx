"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Concern, Resource } from "@/types/resource";

type HomeSearchProps = {
  concerns: Concern[];
  resources: Resource[];
};

export function HomeSearch({ concerns, resources }: HomeSearchProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const concernResults = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return concerns
      .filter((concern) =>
        [concern.title, concern.description, ...concern.keywords]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 3);
  }, [concerns, normalizedQuery]);

  const resourceResults = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return resources
      .filter((resource) =>
        [
          resource.title,
          resource.description,
          ...resource.keywords,
          ...resource.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 4);
  }, [normalizedQuery, resources]);

  const hasResults = concernResults.length > 0 || resourceResults.length > 0;

  return (
    <div className="relative mt-8 w-full max-w-xl">
      <label htmlFor="home-search" className="sr-only">
        자료 검색
      </label>
      <input
        id="home-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="쇼츠, 현질, 디스코드, 댓글처럼 검색해보세요"
        className="w-full rounded-lg border border-[#F59E0B]/45 bg-white px-4 py-3 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15"
      />

      {normalizedQuery ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-3 max-h-[min(28rem,60vh)] overflow-y-auto rounded-lg border border-orange-100 bg-white p-3 shadow-lg">
          {hasResults ? (
            <div className="grid gap-3">
              {concernResults.length > 0 ? (
                <SearchGroup title="고민으로 찾기">
                  {concernResults.map((concern) => (
                    <Link
                      key={concern.id}
                      href={`/concerns?concern=${concern.id}`}
                      className="block rounded-md px-3 py-2 transition hover:bg-[#FF6B35]/10"
                    >
                      <span className="text-sm font-medium text-stone-950">{concern.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-stone-500">
                        {concern.description}
                      </span>
                    </Link>
                  ))}
                </SearchGroup>
              ) : null}

              {resourceResults.length > 0 ? (
                <SearchGroup title="자료 바로가기">
                  {resourceResults.map((resource) => (
                    <Link
                      key={resource.id}
                      href={`/resources/${resource.id}`}
                      className="block rounded-md px-3 py-2 transition hover:bg-[#FF6B35]/10"
                    >
                      <span className="text-sm font-medium text-stone-950">{resource.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-stone-500">
                        {resource.tags.slice(0, 3).join(" · ")}
                      </span>
                    </Link>
                  ))}
                </SearchGroup>
              ) : null}
            </div>
          ) : (
            <p className="px-3 py-2 text-sm text-stone-500">
              검색 결과가 없습니다. 다른 표현으로 다시 검색해보세요.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function SearchGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="px-3 pb-1 text-xs font-semibold text-[#0A7C6E]">{title}</p>
      <div className="grid gap-1">{children}</div>
    </div>
  );
}
