"use client";

import Image from "next/image";
import {
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  WheelEvent,
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

const minZoomScale = 1;
const maxZoomScale = 4;

export function GuideImageCarousel({ images }: GuideImageCarouselProps) {
  const imageCount = images.length;
  const hasMultipleImages = imageCount > 1;
  const [slideIndex, setSlideIndex] = useState(hasMultipleImages ? 1 : 0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  const navigationLocked = useRef(false);
  const fullscreenImageRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === fullscreenImageRef.current);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (isZoomOpen) {
      return;
    }

    if (document.fullscreenElement === fullscreenImageRef.current) {
      document.exitFullscreen().catch(() => undefined);
    }
  }, [isZoomOpen]);

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

  function closeZoomModal() {
    if (document.fullscreenElement === fullscreenImageRef.current) {
      document.exitFullscreen().catch(() => undefined);
    }

    setIsZoomOpen(false);
  }

  function toggleFullscreen() {
    if (!fullscreenImageRef.current || !document.fullscreenEnabled) {
      return;
    }

    if (document.fullscreenElement === fullscreenImageRef.current) {
      document.exitFullscreen().catch(() => undefined);
      return;
    }

    fullscreenImageRef.current.requestFullscreen().catch(() => undefined);
  }

  return (
    <>
      <section
        className="mb-0 rounded-b-lg border-x border-b border-orange-100 bg-white shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/30"
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
                  unoptimized
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
          onClick={closeZoomModal}
        >
          <div
            className="relative flex max-h-full w-full max-w-6xl flex-col justify-center bg-transparent"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={toggleFullscreen}
              className="absolute right-14 top-0 z-10 inline-flex h-10 -translate-y-12 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-stone-950 shadow-sm transition hover:bg-[#FF6B35] hover:text-white"
              aria-label={isFullscreen ? "전체화면 종료" : "전체보기"}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              >
                {isFullscreen ? (
                  <>
                    <path d="M8 3v5H3" />
                    <path d="M16 3v5h5" />
                    <path d="M8 21v-5H3" />
                    <path d="M16 21v-5h5" />
                  </>
                ) : (
                  <>
                    <path d="M8 3H3v5" />
                    <path d="M16 3h5v5" />
                    <path d="M8 21H3v-5" />
                    <path d="M16 21h5v-5" />
                  </>
                )}
              </svg>
              {isFullscreen ? "전체화면 종료" : "전체보기"}
            </button>
            <button
              type="button"
              onClick={closeZoomModal}
              className="absolute right-0 top-0 z-10 flex h-10 w-10 -translate-y-12 items-center justify-center rounded-full bg-white text-lg font-semibold text-stone-950 shadow-sm transition hover:bg-[#FF6B35] hover:text-white"
              aria-label="확대 이미지 닫기"
            >
              x
            </button>

            <div className="overflow-hidden rounded-lg bg-white shadow-2xl">
              <ZoomableModalImage
                image={activeImage}
                isFullscreen={isFullscreen}
                fullscreenRef={fullscreenImageRef}
                hasMultipleImages={hasMultipleImages}
                onPrevious={goPrevious}
                onNext={goNext}
                onExitFullscreen={() => document.exitFullscreen().catch(() => undefined)}
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

function ZoomableModalImage({
  image,
  isFullscreen,
  fullscreenRef,
  hasMultipleImages,
  onPrevious,
  onNext,
  onExitFullscreen,
}: {
  image: GuideImage;
  isFullscreen: boolean;
  fullscreenRef: RefObject<HTMLDivElement | null>;
  hasMultipleImages: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onExitFullscreen: () => void;
}) {
  const [scale, setScale] = useState(minZoomScale);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isPinching, setIsPinching] = useState(false);
  const scaleRef = useRef(scale);
  const activePointers = useRef(new Map<number, { x: number; y: number }>());
  const panStart = useRef({ x: 0, y: 0 });
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const lastPinchDistance = useRef<number | null>(null);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  function updateScale(nextScale: number) {
    const clampedScale = clamp(nextScale, minZoomScale, maxZoomScale);

    setScale(clampedScale);
    scaleRef.current = clampedScale;

    if (clampedScale === minZoomScale) {
      setOffset({ x: 0, y: 0 });
    }
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    const zoomStep = event.deltaY > 0 ? -0.2 : 0.2;
    updateScale(scaleRef.current + zoomStep);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    swipeStart.current = {
      x: event.clientX,
      y: event.clientY,
    };
    activePointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (activePointers.current.size === 1 && scaleRef.current > minZoomScale) {
      panStart.current = {
        x: event.clientX - offset.x,
        y: event.clientY - offset.y,
      };
      setIsPanning(true);
    }

    if (activePointers.current.size === 2) {
      lastPinchDistance.current = getPointerDistance(activePointers.current);
      setIsPanning(false);
      setIsPinching(true);
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!activePointers.current.has(event.pointerId)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    activePointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (activePointers.current.size >= 2) {
      const distance = getPointerDistance(activePointers.current);

      if (distance && lastPinchDistance.current) {
        updateScale(scaleRef.current * (distance / lastPinchDistance.current));
      }

      lastPinchDistance.current = distance;
      return;
    }

    if (isPanning && scaleRef.current > minZoomScale) {
      setOffset({
        x: event.clientX - panStart.current.x,
        y: event.clientY - panStart.current.y,
      });
    }
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    event.stopPropagation();
    const swipe = swipeStart.current;
    activePointers.current.delete(event.pointerId);
    lastPinchDistance.current =
      activePointers.current.size >= 2 ? getPointerDistance(activePointers.current) : null;
    setIsPanning(false);
    setIsPinching(activePointers.current.size >= 2);

    if (
      swipe &&
      hasMultipleImages &&
      scaleRef.current === minZoomScale &&
      activePointers.current.size === 0
    ) {
      const distanceX = event.clientX - swipe.x;
      const distanceY = event.clientY - swipe.y;

      if (Math.abs(distanceX) > 64 && Math.abs(distanceX) > Math.abs(distanceY) * 1.2) {
        if (distanceX > 0) {
          onPrevious();
        } else {
          onNext();
        }
      }
    }

    if (activePointers.current.size === 0) {
      swipeStart.current = null;
    }
  }

  function handleDoubleClick(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (scaleRef.current > minZoomScale) {
      updateScale(minZoomScale);
      return;
    }

    updateScale(2);
  }

  return (
    <div
      ref={fullscreenRef}
      className={`relative flex touch-none select-none items-center justify-center overflow-hidden bg-[#FAFAFA] ${
        isFullscreen ? "h-screen w-screen" : "max-h-[82vh]"
      } ${
        scale > minZoomScale ? (isPanning ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
      }`}
      onClick={(event) => event.stopPropagation()}
      onDoubleClick={handleDoubleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onWheel={handleWheel}
    >
      {isFullscreen ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onExitFullscreen();
          }}
          onPointerDown={(event) => event.stopPropagation()}
          className="absolute right-4 top-4 z-20 rounded-full bg-black/45 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-[#FF6B35]"
        >
          전체화면 종료
        </button>
      ) : null}

      {isFullscreen && hasMultipleImages ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onPrevious();
            }}
            onPointerDown={(event) => event.stopPropagation()}
            aria-label="이전 이미지"
            className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-2xl font-semibold text-white backdrop-blur transition hover:bg-[#FF6B35]/90"
          >
            {"<"}
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
            onPointerDown={(event) => event.stopPropagation()}
            aria-label="다음 이미지"
            className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-2xl font-semibold text-white backdrop-blur transition hover:bg-[#FF6B35]/90"
          >
            {">"}
          </button>
        </>
      ) : null}

      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className={`w-full object-contain ${isFullscreen ? "max-h-screen" : "max-h-[82vh]"}`}
        draggable={false}
        unoptimized
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
          transition: isPanning || isPinching ? "none" : "transform 160ms ease-out",
        }}
      />
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getPointerDistance(pointers: Map<number, { x: number; y: number }>) {
  const [firstPointer, secondPointer] = Array.from(pointers.values());

  if (!firstPointer || !secondPointer) {
    return null;
  }

  return Math.hypot(firstPointer.x - secondPointer.x, firstPointer.y - secondPointer.y);
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
