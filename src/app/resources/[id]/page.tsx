import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideImageGroup, GuideImageTabs } from "@/components/GuideImageTabs";
import { resources } from "@/data/resources";
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

const difficultyLabels: Record<Resource["difficulty"], string> = {
  easy: "쉬움",
  normal: "보통",
  advanced: "심화",
};

const guideGroupLabels: Record<string, string> = {
  default: "이미지 가이드",
  pc: "PC 버전",
  mobile: "모바일 버전",
};

export function generateStaticParams() {
  return resources.map((resource) => ({
    id: resource.id,
  }));
}

export async function generateMetadata({ params }: ResourceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const resource = resources.find((item) => item.id === id);

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
  const resource = resources.find((item) => item.id === id);

  if (!resource) {
    notFound();
  }

  const guideImageGroups = getGuideImageGroups(resource);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-stone-950">
      <section className="border-b border-orange-100 bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
          <Link href="/resources" className="text-sm font-medium text-[#0A7C6E] hover:text-[#075F54]">
            전체 자료로 돌아가기
          </Link>
          <div className="mt-6 max-w-3xl">
            <span className="rounded-md bg-[#FF6B35]/10 px-2.5 py-1 text-xs font-medium text-[#FF6B35]">
              {categoryLabels[resource.category]}
            </span>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-stone-950 sm:text-4xl">
              {resource.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-stone-600">{resource.description}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-5 px-5 pb-16 pt-8 sm:px-6 sm:pb-20 lg:grid-cols-[minmax(0,760px)_320px] lg:items-start lg:justify-center lg:px-8">
        <div className="min-w-0">
          <GuideImageTabs groups={guideImageGroups} />
        </div>

        <aside className="rounded-lg border border-orange-100 bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:mt-[52px]">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <dt className="text-xs font-medium text-stone-500">난이도</dt>
              <dd className="mt-1 text-sm font-semibold text-stone-950">
                {difficultyLabels[resource.difficulty]}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-stone-500">권장 연령</dt>
              <dd className="mt-1 text-sm font-semibold text-stone-950">
                {resource.recommendedAge.join(" · ")}
              </dd>
            </div>
          </dl>

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

function getGuideImageGroups(resource: Resource): GuideImageGroup[] {
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
      const images = getGuideImages(resource, groupId, groupDir);
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
      const prefix =
        groupId === "default" ? `/images/guides/${resource.id}` : `/images/guides/${resource.id}/${groupId}`;

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
