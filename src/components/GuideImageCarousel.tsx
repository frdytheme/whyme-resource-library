"use client";

import Image from "next/image";
import {
  KeyboardEvent,
  PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type GuideImage = {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
};

type GuideImageCarouselProps = {
  images: GuideImage[];
};

export function GuideImageCarousel({ images }: GuideImageCarouselProps) {
  const imageCount = images.length;
  const hasMultipleImages = imageCount > 1;
  const [slideIndex, setSlideIndex] = useState(hasMultipleImages ? 1 : 0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  const navigationLocked = useRef(false);

  const canNavigate = !isAnimating && !isDragging && !isJumping;

  function lockNavigation() {
    navigationLocked.current = true;
    setIsAnimating(true);
  }

  function unlockNavigation() {
    navigationLocked.current = false;
    setIsAnimating(false);
  }

  const goPrevious = useCallback(() => {
    if (!canNavigate || navigationLocked.current) {
      return;
    }

    setIsJumping(false);
    lockNavigation();
    setSlideIndex((current) => current - 1);
  }, [canNavigate]);

  const goNext = useCallback(() => {
    if (!canNavigate || navigationLocked.current) {
      return;
    }

    setIsJumping(false);
    lockNavigation();
    setSlideIndex((current) => current + 1);
  }, [canNavigate]);

  const goTo = useCallback(
    (index: number) => {
      if (!canNavigate || navigationLocked.current) {
        return;
      }

      setIsJumping(false);
      lockNavigation();
      setSlideIndex(hasMultipleImages ? index + 1 : index);
    },
    [canNavigate, hasMultipleImages],
  );

  useEffect(() => {
    if (!isJumping) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      const nextFrame = requestAnimationFrame(() => {
        setIsJumping(false);
        navigationLocked.current = false;
      });

      return () => cancelAnimationFrame(nextFrame);
    });

    return () => cancelAnimationFrame(frame);
  }, [isJumping]);

  useEffect(() => {
    if (!isZoomOpen) {
      return;
    }

    function handleWindowKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsZoomOpen(false);
      }

      if (event.key === "ArrowLeft" && hasMultipleImages) {
        goPrevious();
      }

      if (event.key === "ArrowRight" && hasMultipleImages) {
        goNext();
      }
    }

    window.addEventListener("keydown", handleWindowKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown);
      document.body.style.overflow = "";
    };
  }, [goNext, goPrevious, hasMultipleImages, isZoomOpen]);

  if (imageCount === 0) {
    return null;
  }

  const slides = hasMultipleImages
    ? [images[imageCount - 1], ...images, images[0]]
    : images;
  const activeIndex = getActiveIndex(slideIndex, imageCount, hasMultipleImages);
  const activeImage = images[activeIndex];
  const trackOffset = `calc(${-slideIndex * 100}% + ${dragOffset}px)`;

  function handleTransitionEnd() {
    if (!hasMultipleImages) {
      unlockNavigation();
      return;
    }

    if (slideIndex === 0) {
      navigationLocked.current = true;
      setIsAnimating(false);
      setIsJumping(true);
      setSlideIndex(imageCount);
      return;
    }

    if (slideIndex === imageCount + 1) {
      navigationLocked.current = true;
      setIsAnimating(false);
      setIsJumping(true);
      setSlideIndex(1);
      return;
    }

    unlockNavigation();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!hasMultipleImages) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (navigationLocked.current || isAnimating || isJumping) {
      return;
    }

    pointerStartX.current = event.clientX;
    setIsDragging(true);
    setIsJumping(false);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!hasMultipleImages || !isDragging || pointerStartX.current === null) {
      return;
    }

    setDragOffset(event.clientX - pointerStartX.current);
  }

  function finishDrag(endX: number) {
    if (pointerStartX.current === null) {
      setDragOffset(0);
      setIsDragging(false);
      return;
    }

    const distance = endX - pointerStartX.current;
    pointerStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);

    if (Math.abs(distance) < 8) {
      setIsZoomOpen(true);
      return;
    }

    if (!hasMultipleImages || Math.abs(distance) < 64) {
      return;
    }

    lockNavigation();
    if (distance > 0) {
      setSlideIndex((current) => current - 1);
    } else {
      setSlideIndex((current) => current + 1);
    }
  }

  return (
    <>
      <section
        className="mb-0 overflow-hidden rounded-lg border border-orange-100 bg-white shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/30"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="가이드 이미지 슬라이드"
      >
        <div
          className="relative touch-pan-y select-none overflow-hidden bg-[#FAFAFA]"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(event) => finishDrag(event.clientX)}
          onPointerCancel={() => {
            pointerStartX.current = null;
            setDragOffset(0);
            setIsDragging(false);
          }}
        >
          <div
            className={`flex ${
              isDragging || isJumping ? "" : "transition-transform duration-300 ease-out"
            }`}
            style={{ transform: `translateX(${trackOffset})` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {slides.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="relative w-full shrink-0 cursor-zoom-in bg-[#FAFAFA] text-left"
                role="button"
                aria-label={`${image.label} 크게 보기`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="h-auto w-full"
                  priority={index === 1 || !hasMultipleImages}
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {hasMultipleImages ? (
            <>
              <button
                type="button"
                onClick={goPrevious}
                onPointerDown={(event) => event.stopPropagation()}
                aria-label="이전 이미지"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-lg font-semibold text-stone-950 shadow-sm transition hover:bg-[#FF6B35] hover:text-white"
              >
                {"<"}
              </button>
              <button
                type="button"
                onClick={goNext}
                onPointerDown={(event) => event.stopPropagation()}
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
                  onClick={() => goTo(index)}
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

      {isZoomOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="확대 이미지 보기"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-h-full w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute right-0 top-0 z-10 flex h-10 w-10 -translate-y-12 items-center justify-center rounded-full bg-white text-lg font-semibold text-stone-950 shadow-sm transition hover:bg-[#FF6B35] hover:text-white"
              aria-label="확대 이미지 닫기"
            >
              x
            </button>

            <div className="overflow-hidden rounded-lg bg-white shadow-2xl">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                width={activeImage.width}
                height={activeImage.height}
                className="max-h-[82vh] w-full object-contain"
                draggable={false}
              />
              <div className="flex items-center justify-between gap-3 border-t border-orange-100 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-stone-950">{activeImage.label}</p>
                  <p className="mt-1 text-xs text-stone-500">
                    {activeIndex + 1} / {imageCount}
                  </p>
                </div>
                {hasMultipleImages ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={goPrevious}
                      className="rounded-md border border-orange-100 px-3 py-2 text-sm font-semibold text-stone-800 transition hover:border-[#FF6B35]"
                    >
                      이전
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="rounded-md border border-orange-100 px-3 py-2 text-sm font-semibold text-stone-800 transition hover:border-[#FF6B35]"
                    >
                      다음
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function getActiveIndex(
  slideIndex: number,
  imageCount: number,
  hasMultipleImages: boolean,
) {
  if (!hasMultipleImages) {
    return slideIndex;
  }

  if (slideIndex === 0) {
    return imageCount - 1;
  }

  if (slideIndex === imageCount + 1) {
    return 0;
  }

  return slideIndex - 1;
}
