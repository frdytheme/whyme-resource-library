import Link from "next/link";
import Image from "next/image";
import { HomeSearch } from "@/components/HomeSearch";
import { concerns } from "@/data/concerns";
import { visibleResources } from "@/data/visibleResources";

const kakaoChannelUrl = "https://linktr.ee/why_me_brand";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-stone-950">
      <section className="border-b border-orange-100 bg-white">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-5 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#0A7C6E]">WHYME Resource Library</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-normal text-stone-950 sm:text-5xl">
              가정에서 바로 실행할 수 있는 미디어 교육 자료집
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
              아이의 미디어 사용이 걱정될 때, 지금 필요한 자료를 고민별로 찾거나 전체 자료실에서 천천히 살펴보세요.
            </p>

            <HomeSearch concerns={concerns} resources={visibleResources} />

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Link
                href="/concerns"
                className="rounded-lg border border-[#FF6B35] bg-[#FF6B35] px-5 py-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#E85B2B] hover:shadow-md"
              >
                무엇이 필요하신가요?
              </Link>
              <Link
                href="/packages"
                className="rounded-lg border border-[#0A7C6E]/30 bg-white px-5 py-4 text-sm font-semibold text-[#0A7C6E] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#0A7C6E] hover:bg-[#F0FAF8] hover:shadow-md"
              >
                상황별 추천 설정 모음
              </Link>
              <Link
                href="/resources"
                className="rounded-lg border border-[#F59E0B]/45 bg-white px-5 py-4 text-sm font-semibold text-stone-950 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#FF6B35] hover:shadow-md"
              >
                전체 자료 보기
              </Link>
            </div>
          </div>

          <div className="flex w-full max-w-sm flex-col gap-3 lg:max-w-md">
            <div className="flex w-full justify-center rounded-lg border border-orange-100 bg-[#FAFAFA] px-8 py-10 shadow-sm sm:px-10">
              <Image
                src="/images/brand/whyme-logo.png"
                alt="WHYME 로고"
                width={1200}
                height={600}
                priority
                className="h-auto w-full max-w-xs object-contain sm:max-w-sm"
              />
            </div>
            <a
              href={kakaoChannelUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-lg border border-[#FF6B35]/25 bg-white px-5 py-4 text-sm font-semibold text-[#FF6B35] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#FF6B35] hover:bg-[#FFF4EE] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/35 focus:ring-offset-2"
            >
              와이미 교육 문의
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
