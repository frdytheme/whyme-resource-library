"use client";

import Link from "next/link";
import { useState } from "react";
import { PackageId, ResourcePackage, Resource } from "@/types/resource";

type PackageCollectionProps = {
  packages: ResourcePackage[];
  resources: Resource[];
};

export function PackageCollection({ packages, resources }: PackageCollectionProps) {
  const [openPackageId, setOpenPackageId] = useState<PackageId | "">(packages[0]?.id ?? "");
  const resourcesById = new Map(resources.map((resource) => [resource.id, resource]));

  return (
    <div className="grid gap-3">
      {packages.map((resourcePackage) => {
        const packageResources = resourcePackage.resourceIds
          .map((resourceId) => resourcesById.get(resourceId))
          .filter((resource): resource is Resource => Boolean(resource));
        const isOpen = resourcePackage.id === openPackageId;

        return (
          <section
            key={resourcePackage.id}
            className={`overflow-hidden rounded-lg border shadow-sm transition duration-200 ${
              isOpen
                ? "border-[#FF6B35]/45 bg-[#FFF4EE] ring-1 ring-[#FF6B35]/10"
                : "border-orange-100 bg-white hover:border-[#FF6B35]/35"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenPackageId(isOpen ? "" : resourcePackage.id)}
              aria-expanded={isOpen}
              className={`flex w-full items-start justify-between gap-4 p-5 text-left transition ${
                isOpen ? "bg-[#FFF4EE]" : "hover:bg-[#FFF4EE]/50"
              }`}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold text-[#0A7C6E]">추천 설정 패키지</p>
                  <span className="rounded-md bg-[#FF6B35]/10 px-2.5 py-1 text-xs font-medium text-[#FF6B35]">
                    {packageResources.length}개
                  </span>
                </div>
                <h2 className="mt-2 text-lg font-semibold leading-7 text-stone-950">
                  {resourcePackage.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {resourcePackage.description}
                </p>
              </div>
              <span
                className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-lg font-semibold transition ${
                  isOpen
                    ? "rotate-45 border-[#FF6B35]/35 bg-white text-[#FF6B35]"
                    : "border-orange-100 bg-[#FAFAFA] text-stone-700"
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>

            {isOpen ? (
              <div className="grid gap-2 border-t border-orange-100 bg-[#FAFAFA] p-4">
                {packageResources.map((resource, index) => (
                  <Link
                    key={resource.id}
                    href={`/resources/${resource.id}?from=packages`}
                    className="flex items-center gap-3 rounded-lg border border-orange-100 bg-white px-3 py-3 text-sm transition hover:border-[#FF6B35] hover:bg-[#FFF4EE]"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#FAFAFA] text-xs font-semibold text-stone-500">
                      {index + 1}
                    </span>
                    <span className="font-medium text-stone-900">{resource.title}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
