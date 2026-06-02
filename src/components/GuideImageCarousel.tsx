"use client";

import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";

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
  guideId?: string;
  initialIndex?: number;
};

export function GuideImageCarousel({
  images,
  guideId = "default",
  initialIndex = 0,
}: GuideImageCarouselProps) {
  const imageCount = images.length;
  const initialSafeIndex =
    Number.isFinite(initialIndex) && imageCount > 0
      ? Math.min(Math.max(Math.trunc(initialIndex), 0), imageCount - 1)
      : 0;
  const [activeIndex, setActiveIndex] = useState(initialSafeIndex);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const inlineFullscreenRef = useRef<HTMLDivElement | null>(null);
  const modalFullscreenRef = useRef<HTMLDivElement | null>(null);
  const hasMultipleImages = imageCount > 1;

  const safeActiveIndex = imageCount > 0 ? Math.min(activeIndex, imageCount - 1) : 0;
  const activeImage = images[safeActiveIndex] ?? images[0];
  const imageSrc = activeImage?.displaySrc ?? activeImage?.src;
  const imageWidth = activeImage?.displayWidth ?? activeImage?.width;
  const imageHeight = activeImage?.displayHeight ?? activeImage?.height;
  const zoomImageSrc = activeImage?.src;
  const zoomImageWidth = activeImage?.width;
  const zoomImageHeight = activeImage?.height;
  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(
        document.fullscreenElement === inlineFullscreenRef.current ||
          document.fullscreenElement === modalFullscreenRef.current,
      );
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const getImageHref = useCallback(
    (index: number) => `?guide=${encodeURIComponent(guideId)}&image=${index}`,
    [guideId],
  );

  const goTo = useCallback(
    (index: number) => {
      const nextIndex = (index + imageCount) % imageCount;

      setActiveIndex(nextIndex);
      window.history.replaceState(null, "", getImageHref(nextIndex));
    },
    [getImageHref, imageCount],
  );

  const goPrevious = useCallback(() => {
    goTo(safeActiveIndex - 1);
  }, [goTo, safeActiveIndex]);

  const goNext = useCallback(() => {
    goTo(safeActiveIndex + 1);
  }, [goTo, safeActiveIndex]);

  function handleSwipeEnd(endX: number) {
    if (touchStartX.current === null) {
      return;
    }

    const distance = endX - touchStartX.current;
    touchStartX.current = null;

    if (!hasMultipleImages || Math.abs(distance) < 48) {
      return;
    }

    if (distance > 0) {
      goPrevious();
      return;
    }

    goNext();
  }

  function handleNavigationClick(event: MouseEvent<HTMLAnchorElement>, index: number) {
    event.preventDefault();
    goTo(index);
  }

  const previousIndex = (safeActiveIndex - 1 + imageCount) % imageCount;
  const nextIndex = (safeActiveIndex + 1) % imageCount;

  function openZoom() {
    if (
      window.matchMedia("(pointer: coarse)").matches &&
      inlineFullscreenRef.current &&
      document.fullscreenEnabled
    ) {
      inlineFullscreenRef.current.requestFullscreen().catch(() => undefined);
      return;
    }

    setIsZoomOpen(true);
  }

  function toggleFullscreen() {
    if (!modalFullscreenRef.current || !document.fullscreenEnabled) {
      return;
    }

    if (document.fullscreenElement === modalFullscreenRef.current) {
      document.exitFullscreen().catch(() => undefined);
      return;
    }

    modalFullscreenRef.current.requestFullscreen().catch(() => undefined);
  }

  const closeZoom = useCallback(() => {
    if (
      document.fullscreenElement === inlineFullscreenRef.current ||
      document.fullscreenElement === modalFullscreenRef.current
    ) {
      document.exitFullscreen().catch(() => undefined);
    }

    setIsZoomOpen(false);
  }, []);

  useEffect(() => {
    if (!isZoomOpen) {
      return;
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        closeZoom();
      }

      if (event.key === "ArrowLeft" && hasMultipleImages) {
        goPrevious();
      }

      if (event.key === "ArrowRight" && hasMultipleImages) {
        goNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [closeZoom, goNext, goPrevious, hasMultipleImages, isZoomOpen]);

  if (
    imageCount === 0 ||
    !activeImage ||
    !imageSrc ||
    !imageWidth ||
    !imageHeight ||
    !zoomImageSrc ||
    !zoomImageWidth ||
    !zoomImageHeight
  ) {
    return null;
  }

  return (
    <>
      <section className="mb-0 overflow-hidden rounded-b-lg border-x border-b border-orange-100 bg-white shadow-sm">
        <div
          ref={inlineFullscreenRef}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            handleSwipeEnd(event.changedTouches[0]?.clientX ?? 0);
          }}
          className={`relative bg-[#FAFAFA] ${isFullscreen ? "flex h-screen w-screen items-center justify-center" : ""}`}
        >
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              openZoom();
            }}
            className="block w-full touch-manipulation cursor-zoom-in bg-transparent p-0 text-left"
            aria-label={`${activeImage.label} 크게 보기`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={imageSrc}
              src={imageSrc}
              alt={activeImage.alt}
              width={imageWidth}
              height={imageHeight}
              className={`${isFullscreen ? "max-h-screen w-full object-contain" : "h-auto w-full"}`}
              loading="eager"
              decoding="async"
            />
          </button>

          {hasMultipleImages ? (
            <>
              <a
                href={getImageHref(previousIndex)}
                onClick={(event) => handleNavigationClick(event, previousIndex)}
                aria-label="이전 이미지"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-lg font-semibold text-stone-950 shadow-sm transition hover:bg-[#FF6B35] hover:text-white"
              >
                {"<"}
              </a>
              <a
                href={getImageHref(nextIndex)}
                onClick={(event) => handleNavigationClick(event, nextIndex)}
                aria-label="다음 이미지"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-lg font-semibold text-stone-950 shadow-sm transition hover:bg-[#FF6B35] hover:text-white"
              >
                {">"}
              </a>
            </>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-orange-100 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-stone-950">{activeImage.label}</p>
            <p className="mt-1 text-xs text-stone-500">
              {safeActiveIndex + 1} / {imageCount}
            </p>
          </div>

          {hasMultipleImages ? (
            <div className="flex shrink-0 gap-1.5">
              {images.map((image, index) => (
                <a
                  key={image.src}
                  href={getImageHref(index)}
                  onClick={(event) => handleNavigationClick(event, index)}
                  aria-label={`${image.label} 보기`}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    index === safeActiveIndex ? "bg-[#FF6B35]" : "bg-[#F59E0B]/30 hover:bg-[#F59E0B]"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <div
        className={`fixed inset-0 z-50 items-center justify-center bg-black/80 p-4 ${
          isZoomOpen ? "flex" : "hidden"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="확대 이미지 보기"
        onClick={closeZoom}
      >
        <div
          className="relative flex max-h-full w-full max-w-6xl flex-col justify-center bg-transparent"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="absolute right-0 top-0 z-10 flex -translate-y-12 gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-stone-950 shadow-sm transition hover:bg-[#FF6B35] hover:text-white"
              aria-label={isFullscreen ? "전체화면 종료" : "전체화면 보기"}
            >
              {isFullscreen ? "전체화면 종료" : "전체화면"}
            </button>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                closeZoom();
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-semibold text-stone-950 shadow-sm transition hover:bg-[#FF6B35] hover:text-white"
              aria-label="확대 이미지 닫기"
            >
              x
            </a>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow-2xl">
            <div
              ref={modalFullscreenRef}
              className={`relative flex items-center justify-center bg-[#FAFAFA] ${
                isFullscreen ? "h-screen w-screen" : "max-h-[82vh]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={`zoom-${zoomImageSrc}`}
                src={zoomImageSrc}
                alt={activeImage.alt}
                width={zoomImageWidth}
                height={zoomImageHeight}
                className={`w-full object-contain ${isFullscreen ? "max-h-screen" : "max-h-[82vh]"}`}
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-orange-100 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-stone-950">{activeImage.label}</p>
                <p className="mt-1 text-xs text-stone-500">
                  {safeActiveIndex + 1} / {imageCount}
                </p>
              </div>

              {hasMultipleImages ? (
                <div className="flex gap-2">
                  <a
                    href={getImageHref(previousIndex)}
                    onClick={(event) => handleNavigationClick(event, previousIndex)}
                    className="rounded-md border border-orange-100 px-3 py-2 text-sm font-semibold text-stone-800 transition hover:border-[#FF6B35]"
                  >
                    이전
                  </a>
                  <a
                    href={getImageHref(nextIndex)}
                    onClick={(event) => handleNavigationClick(event, nextIndex)}
                    className="rounded-md border border-orange-100 px-3 py-2 text-sm font-semibold text-stone-800 transition hover:border-[#FF6B35]"
                  >
                    다음
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
