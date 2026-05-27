import Link from "next/link";
import { HomeSearch } from "@/components/HomeSearch";
import { concerns } from "@/data/concerns";
import { resources } from "@/data/resources";

const contributionCells = Array.from({ length: 42 }, (_, index) => {
  const tones = [
    "bg-[#FAFAFA]",
    "bg-[#F59E0B]/25",
    "bg-[#F59E0B]/55",
    "bg-[#FF6B35]/60",
    "bg-[#0A7C6E]/45",
  ];

  return tones[(index * 7 + index) % tones.length];
});

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

            <HomeSearch concerns={concerns} resources={resources} />

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/concerns"
                className="rounded-lg border border-[#FF6B35] bg-[#FF6B35] px-5 py-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#E85B2B] hover:shadow-md"
              >
                무엇이 필요하신가요?
              </Link>
              <Link
                href="/resources"
                className="rounded-lg border border-[#F59E0B]/45 bg-white px-5 py-4 text-sm font-semibold text-stone-950 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#FF6B35] hover:shadow-md"
              >
                전체 자료 보기
              </Link>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-lg border border-orange-100 bg-[#FAFAFA] p-4">
            <div className="mb-3 flex items-center justify-between text-xs text-stone-500">
              <span>자료 분포</span>
              <span>{resources.length}개 자료</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5" aria-hidden="true">
              {contributionCells.map((tone, index) => (
                <span key={index} className={`aspect-square rounded-sm ${tone}`} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
