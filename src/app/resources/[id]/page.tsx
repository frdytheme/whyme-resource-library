import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GuideImageGroup, GuideImageTabs } from "@/components/GuideImageTabs";
import {
  ResourceReturnIconButton,
  ResourceReturnTextLink,
} from "@/components/ResourceReturnControls";
import { visibleResources } from "@/data/visibleResources";
import { Resource } from "@/types/resource";

type ResourceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type GuideImage = {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
};

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

const guideGroupLabels: Record<string, string> = {
  default: "이미지 가이드",
  pc: "PC 버전",
  mobile: "이미지 가이드(Phone)",
};

export function generateStaticParams() {
  return visibleResources.map((resource) => ({
    id: resource.id,
  }));
}

export async function generateMetadata({ params }: ResourceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const resource = visibleResources.find((item) => item.id === id);

  if (!resource) {
    return {
      title: "자료를 찾을 수 없습니다",
    };
  }

  return {
    title: resource.title,
    description: resource.description,
  };
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { id } = await params;
  const resource = visibleResources.find((item) => item.id === id);

  if (!resource) {
    notFound();
  }

  const guideImageGroups = getGuideImageGroups(resource);
  const downloadUrl = getAvailableDownloadUrl(resource);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-stone-950">
      <section className="border-b border-orange-100 bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <Link href="/resources" className="text-sm font-medium text-[#0A7C6E] hover:text-[#075F54]">
                전체 자료로 돌아가기
              </Link>
            }
          >
            <ResourceReturnTextLink />
          </Suspense>
          <div className="flex items-start justify-between gap-5">
            <div className="mt-6 max-w-3xl">
              <span
                className={`rounded-md px-2.5 py-1 text-xs font-medium ${categoryBadgeStyles[resource.category]}`}
              >
                {categoryLabels[resource.category]}
              </span>
              <h1 className="balanced-korean mt-4 text-3xl font-semibold leading-tight text-stone-950 sm:text-4xl">
                {resource.title}
              </h1>
              <p className="balanced-korean mt-4 text-base leading-7 text-stone-600">
                {resource.description}
              </p>
            </div>
            <Suspense
              fallback={
                <Link
                  href="/resources"
                  aria-label="뒤로 가기"
                  title="뒤로 가기"
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-orange-100 bg-[#FAFAFA] text-stone-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#FF6B35] hover:bg-[#FFF4EE] hover:text-[#FF6B35] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/35 focus:ring-offset-2"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Link>
              }
            >
              <ResourceReturnIconButton />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-5 px-5 pb-16 pt-8 sm:px-6 sm:pb-20 lg:grid-cols-[minmax(0,760px)_320px] lg:items-start lg:justify-center lg:px-8">
        <div className="min-w-0">
          <GuideImageTabs groups={guideImageGroups} videoGuides={resource.videoGuides} />
        </div>

        <aside className="rounded-lg border border-orange-100 bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:mt-[52px]">
          <dl>
            <div>
              <dt className="text-xs font-medium text-stone-500">권장 연령</dt>
              <dd className="mt-1 text-sm font-semibold text-stone-950">
                {resource.recommendedAge.join(" · ")}
              </dd>
            </div>
          </dl>

          {downloadUrl ? (
            <div className="mt-5 border-t border-orange-100 pt-5">
              <a
                href={downloadUrl}
                download
                className="inline-flex w-full items-center justify-center rounded-lg border border-[#FF6B35]/25 bg-[#FFF4EE] px-4 py-3 text-sm font-semibold text-[#FF6B35] transition hover:border-[#FF6B35] hover:bg-white"
              >
                인쇄용 PDF 다운로드
              </a>
            </div>
          ) : null}

          <div className="mt-5 border-t border-orange-100 pt-5">
            <h2 className="text-sm font-semibold text-stone-950">태그</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <span key={tag} className="rounded-md border border-[#F59E0B]/35 px-2.5 py-1 text-xs text-stone-600">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-orange-100 pt-5">
            <h2 className="text-sm font-semibold text-stone-950">검색 키워드</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{resource.keywords.join(", ")}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function getAvailableDownloadUrl(resource: Resource) {
  if (!resource.downloadUrl) {
    return null;
  }

  const downloadPath = path.join(
    process.cwd(),
    "public",
    ...resource.downloadUrl.replace(/^\//, "").split("/"),
  );

  return fs.existsSync(downloadPath) ? resource.downloadUrl : null;
}

function getGuideImageGroups(resource: Resource): GuideImageGroup[] {
  if (resource.imageGuideGroups && resource.imageGuideGroups.length > 0) {
    return resource.imageGuideGroups
      .map((group) => {
        const groupDir = path.join(
          process.cwd(),
          "public",
          "images",
          "guides",
          group.directory,
        );

        return {
          id: group.id,
          label: group.label,
          images: getGuideImages(resource, group.id, groupDir, group.directory),
        };
      })
      .filter((group) => group.images.length > 0);
  }

  const dir = path.join(process.cwd(), "public", "images", "guides", resource.id);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const groupIds = ["default", "pc", "mobile"];
  const hasMobileGroup = getGuideImages(
    resource,
    "mobile",
    path.join(dir, "mobile"),
  ).length > 0;

  return groupIds
    .map((groupId) => {
      const groupDir = groupId === "default" ? dir : path.join(dir, groupId);
      const directory = groupId === "default" ? resource.id : `${resource.id}/${groupId}`;
      const images = getGuideImages(resource, groupId, groupDir, directory);
      const label =
        groupId === "default" && hasMobileGroup
          ? "이미지 가이드(PC)"
          : guideGroupLabels[groupId] ?? groupId;

      return {
        id: groupId,
        label,
        images,
      };
    })
    .filter((group) => group.images.length > 0);
}

function getGuideImages(
  resource: Resource,
  groupId: string,
  dir: string,
  directory = resource.id,
): GuideImage[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".webp"))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

  return files
    .filter((file) => file === "cover.webp" || /^step-\d+\.webp$/.test(file))
    .map((file) => {
      const isCover = file === "cover.webp";
      const stepMatch = file.match(/^step-(\d+)\.webp$/);
      const stepNumber = stepMatch ? Number(stepMatch[1]) : null;
      const prefix = `/images/guides/${directory}`;

      return {
        src: `${prefix}/${file}`,
        alt: isCover
          ? `${resource.title} 대표 이미지`
          : `${resource.title} ${guideGroupLabels[groupId] ?? ""} 단계 ${stepNumber ?? ""}`,
        label: isCover ? "대표 이미지" : `단계 ${stepNumber}`,
        ...getWebpSize(path.join(dir, file)),
      };
    });
}

function getWebpSize(filePath: string) {
  const buffer = fs.readFileSync(filePath);
  const riffHeader = buffer.toString("ascii", 0, 4);
  const webpHeader = buffer.toString("ascii", 8, 12);

  if (riffHeader !== "RIFF" || webpHeader !== "WEBP") {
    return { width: 1600, height: 1000 };
  }

  const chunkType = buffer.toString("ascii", 12, 16);

  if (chunkType === "VP8X") {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }

  if (chunkType === "VP8 ") {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  if (chunkType === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }

  return { width: 1600, height: 1000 };
}
