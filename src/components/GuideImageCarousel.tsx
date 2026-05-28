"use client";

import { useState } from "react";

type GuideImage = {
  src: string;
  displaySrc?: string;
  alt: string;
  label: string;
  width: number;
  height: number;
  displayWidth?: number;
  displayHeight?: number;
};

type GuideImageCarouselProps = {
  images: GuideImage[];
};

export function GuideImageCarousel({ images }: GuideImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageCount = images.length;
  const hasMultipleImages = imageCount > 1;

  if (imageCount === 0) {
    return null;
  }

  const activeImage = images[activeIndex] ?? images[0];
  const imageSrc = activeImage.displaySrc ?? activeImage.src;
  const imageWidth = activeImage.displayWidth ?? activeImage.width;
  const imageHeight = activeImage.displayHeight ?? activeImage.height;

  function goPrevious() {
    setActiveIndex((current) => (current - 1 + imageCount) % imageCount);
  }

  function goNext() {
    setActiveIndex((current) => (current + 1) % imageCount);
  }

  return (
    <section className="mb-0 overflow-hidden rounded-b-lg border-x border-b border-orange-100 bg-white shadow-sm">
      <div className="relative bg-[#FAFAFA]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={imageSrc}
          src={imageSrc}
          alt={activeImage.alt}
          width={imageWidth}
          height={imageHeight}
          className="h-auto w-full"
          loading="eager"
          decoding="async"
        />

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              onClick={goPrevious}
              aria-label="이전 이미지"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-lg font-semibold text-stone-950 shadow-sm transition hover:bg-[#FF6B35] hover:text-white"
            >
              {"<"}
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="다음 이미지"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-lg font-semibold text-stone-950 shadow-sm transition hover:bg-[#FF6B35] hover:text-white"
            >
              {">"}
            </button>
          </>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-orange-100 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-stone-950">{activeImage.label}</p>
          <p className="mt-1 text-xs text-stone-500">
            {activeIndex + 1} / {imageCount}
          </p>
        </div>

        {hasMultipleImages ? (
          <div className="flex shrink-0 gap-1.5">
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${image.label} 보기`}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  index === activeIndex ? "bg-[#FF6B35]" : "bg-[#F59E0B]/30 hover:bg-[#F59E0B]"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
