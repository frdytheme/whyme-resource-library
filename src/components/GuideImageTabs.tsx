"use client";

import { useState } from "react";
import { GuideImageCarousel } from "@/components/GuideImageCarousel";
import { VideoGuide } from "@/types/resource";

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
  videoGuides?: VideoGuide[];
};

type GuideTab =
  | {
      id: string;
      label: string;
      type: "image";
      group: GuideImageGroup;
    }
  | {
      id: string;
      label: string;
      type: "video";
      video: VideoGuide;
    };

export function GuideImageTabs({ groups, videoGuides = [] }: GuideImageTabsProps) {
  const visibleGroups = groups.filter((group) => group.images.length > 0);
  const visibleVideos = videoGuides
    .map((video) => ({
      ...video,
      url: video.url.trim(),
    }))
    .filter((video) => video.url.length > 0);
  const tabs: GuideTab[] = [
    ...(visibleVideos.length > 0
      ? visibleVideos.map((video, index) => ({
          id: `video-${index}`,
          label: visibleVideos.length > 1 ? video.title : "영상 가이드",
          type: "video" as const,
          video,
        }))
      : []),
    ...visibleGroups.map((group) => ({
      id: group.id,
      label: group.label,
      type: "image" as const,
      group,
    })),
  ];
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? "");

  if (tabs.length === 0) {
    return null;
  }

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  if (tabs.length === 1) {
    return activeTab.type === "image" ? (
      <GuideImageCarousel images={activeTab.group.images} />
    ) : (
      <VideoGuidePanel video={activeTab.video} />
    );
  }

  return (
    <section className="mb-0">
      <div className="mb-3 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-[#FF6B35] bg-[#FF6B35] text-white shadow-sm"
                  : "border-orange-100 bg-white text-stone-700 hover:border-[#FF6B35]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab.type === "image" ? (
        <GuideImageCarousel key={activeTab.id} images={activeTab.group.images} />
      ) : (
        <VideoGuidePanel video={activeTab.video} />
      )}
    </section>
  );
}

function VideoGuidePanel({ video }: { video: VideoGuide }) {
  const embedUrl = getYoutubeEmbedUrl(video.url);

  return (
    <article className="overflow-hidden rounded-lg border border-orange-100 bg-white shadow-sm">
      {embedUrl ? (
        <div className="aspect-video w-full bg-stone-100">
          <iframe
            src={embedUrl}
            title={video.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : null}

      <div className="p-4">
        <h2 className="text-base font-semibold text-stone-950">{video.title}</h2>
        {video.description ? (
          <p className="mt-2 text-sm leading-6 text-stone-600">{video.description}</p>
        ) : null}
        <a
          href={video.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center rounded-lg border border-[#FF6B35]/25 bg-[#FFF4EE] px-4 py-2 text-sm font-semibold text-[#FF6B35] transition hover:border-[#FF6B35] hover:bg-white"
        >
          유튜브에서 보기
        </a>
      </div>
    </article>
  );
}

function getYoutubeEmbedUrl(url: string) {
  try {
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    const parsedUrl = new URL(normalizedUrl);
    const host = parsedUrl.hostname.replace(/^www\./, "");
    const videoId =
      host === "youtu.be"
        ? parsedUrl.pathname.slice(1)
        : parsedUrl.searchParams.get("v");

    if (!videoId) {
      return null;
    }

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}
