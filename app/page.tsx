"use client";

import { ChatbotWidget } from "./ChatbotWidget";

const navItems = [
  { id: "background", label: "Background" },
  { id: "solution", label: "Solution" },
  { id: "technology", label: "Technology" },
  { id: "benefit", label: "Benefit" },
  { id: "usecases", label: "Use Cases" },
];

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sticky Header */}
      <header className="fixed inset-x-0 top-0 z-30 bg-slate-950/40 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a
            href="#hero"
            className="flex items-center gap-2 rounded-full px-3 py-2 text-lg font-bold tracking-tight text-white ring-1 ring-white/10 hover:text-emerald-200 hover:ring-emerald-300/60 transition-colors"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/30">
              C
            </span>
            <span>CloudPort</span>
          </a>
          <nav className="hidden items-center gap-10 text-sm font-medium md:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-emerald-300 hover:text-white transition-transform transition-colors duration-200 hover:scale-105"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <a
              href="#contact"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </header>

      {/* Scroll-snap main */}
      <main className="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth">
        <section
          id="hero"
          className="snap-start relative flex min-h-screen items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.25),transparent_35%)]" />
          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 text-center">
            <p className="text-emerald-300 text-sm font-semibold uppercase tracking-[0.2em]">
              LLM 기반 지능형 항만 관리 시스템
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              항만의 모든 변수를 예측하다,
              <br />
              CloudPort AI 스케줄링
            </h1>
            <p className="max-w-3xl text-lg text-slate-200/90">
              AIS·VTS·Port-MIS와 비정형 텍스트를 통합 분석해 도선·예선 배정을 자동화하고,
              운영 효율을 59%까지 단축한 검증된 플랫폼입니다.
            </p>
            <div className="grid w-full max-w-3xl gap-4 md:grid-cols-3">
              {[
                {
                  title: "신뢰성 96%",
                  desc: "여수·광양항 실증 배정 신뢰도",
                },
                {
                  title: "59% 단축",
                  desc: "업무 프로세스 시간 절감",
                },
                {
                  title: "AI 검증 적합",
                  desc: "공인기관 AI 신뢰성 판정",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left shadow-lg backdrop-blur"
                >
                  <div className="text-sm text-emerald-300">{item.desc}</div>
                  <div className="mt-1 text-2xl font-bold">{item.title}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <a
                href="#background"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10 shadow-[0_0_30px_rgba(16,185,129,0.25)] animate-bounce transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                aria-label="배경 섹션으로 이동"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-emerald-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14" />
                  <path d="M19 12l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section
          id="background"
          className="snap-start flex min-h-screen items-center bg-slate-900"
        >
          <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <p className="text-emerald-300 text-sm font-semibold uppercase tracking-[0.2em]">
                Background
              </p>
              <h2 className="text-3xl font-bold leading-tight">
                한계에 도달한 아날로그 항만 운영, 혁신이 시급합니다.
              </h2>
              <p className="text-slate-300">
                수동 관제, 데이터 단절, 비정형 변수 대응 불가로 체선율과 비용이 증가하고 있습니다.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                {
                  title: "비효율적 수동 관제",
                  desc: "경험 의존 배정으로 휴먼 에러와 편차 발생",
                  stat: "업무 시간 59% 단축 필요",
                },
                {
                  title: "데이터 단절",
                  desc: "AIS, VTS, Port-MIS가 통합되지 않아 실시간 판단 곤란",
                  stat: "체선율 23% vs 전국 3.1%",
                },
                {
                  title: "비정형 변수 미대응",
                  desc: "기상/사고/법령 텍스트를 읽지 못해 대응 지연",
                  stat: "인적 과실 80%+",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur"
                >
                  <div className="text-sm text-emerald-300">{item.stat}</div>
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-1 text-slate-200/90">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="solution"
          className="snap-start flex min-h-screen items-center bg-slate-950"
        >
          <div className="mx-auto max-w-5xl px-6 py-16">
            <p className="text-emerald-300 text-sm font-semibold uppercase tracking-[0.2em]">
              Solution
            </p>
            <h2 className="mt-2 text-3xl font-bold leading-tight">
              CloudPort: 데이터 통합 → AI 자동 배정 → LLM 변수 대응
            </h2>
            <p className="mt-3 max-w-3xl text-slate-300">
              항만 운영의 A to Z를 하나로 연결하는 통합 플랫폼입니다.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "AI 스케줄링 엔진",
                  desc: "가중치 기반 최적 배정과 강화학습으로 정확도 지속 향상",
                },
                {
                  title: "LLM 변수 대응",
                  desc: "기상·사고·법령 텍스트를 읽고 선제적 재스케줄",
                },
                {
                  title: "통합 관제 대시보드",
                  desc: "AIS/VTS/Port-MIS 실시간 모니터링과 ETA/지연 인사이트",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-5 shadow-lg"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-slate-200/90">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 grid gap-3 md:grid-cols-4">
              {["수집", "전처리", "AI 분석", "서비스"].map((step, i) => (
                <div
                  key={step}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
                >
                  <div className="text-sm text-emerald-300">Step {i + 1}</div>
                  <div className="mt-2 font-semibold">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="technology"
          className="snap-start flex min-h-screen items-center bg-slate-900"
        >
          <div className="mx-auto max-w-5xl px-6 py-16">
            <p className="text-emerald-300 text-sm font-semibold uppercase tracking-[0.2em]">
              Technology
            </p>
            <h2 className="mt-2 text-3xl font-bold leading-tight">
              Core Technology: AI 최적화 + LLM + Big Data Fabric
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "AI 최적 배정 엔진",
                  desc: "Score 기반 가중치 최적화와 강화학습으로 신뢰도 고도화",
                },
                {
                  title: "LLM 회복탄력성",
                  desc: "텍스트 변수(기상/사고/법령)를 이해해 자동 조정",
                },
                {
                  title: "빅데이터 패브릭",
                  desc: "AIS·VTS·Port-MIS·기상 API 통합, ETA 정밀 산출",
                },
                {
                  title: "분산 처리",
                  desc: "Hadoop/Spark 기반 대용량 실시간 처리",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg"
                >
                  <h3 className="text-xl font-semibold text-emerald-300">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-slate-200/90">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200/90">
              {[
                "특허: 데이터 기반 도선사 자동 배정",
                "특허: AIS/VTS 융합 스케줄 관리",
                "AI 신뢰성 검증 적합",
                "SW 저작권 등록",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          id="benefit"
          className="snap-start flex min-h-screen items-center bg-slate-950"
        >
          <div className="mx-auto max-w-5xl px-6 py-16">
            <p className="text-emerald-300 text-sm font-semibold uppercase tracking-[0.2em]">
              Benefit
            </p>
            <h2 className="mt-2 text-3xl font-bold leading-tight">
              데이터로 증명된 성과
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {[
                { title: "59% 단축", desc: "업무 프로세스 운영 시간" },
                { title: "96% 신뢰도", desc: "도선사 자동 배정 정확도" },
                { title: "체선율 감소", desc: "대기 비용·물류비 절감" },
                { title: "신뢰성 검증", desc: "AI 적합 판정 완료" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center shadow-lg"
                >
                  <div className="text-2xl font-bold text-emerald-300">
                    {item.title}
                  </div>
                  <p className="mt-2 text-slate-200/90">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "경제성",
                  desc: "체선율 감소로 비용 절감, 회전율 향상",
                },
                {
                  title: "안전",
                  desc: "휴먼에러 저감, 위험 요인 선제 감지",
                },
                {
                  title: "환경",
                  desc: "공회전 감소로 연료·탄소 절감",
                },
                {
                  title: "확장성",
                  desc: "데이터 기반 정책·해외 확장 지원",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-slate-200/90">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="usecases"
          className="snap-start flex min-h-screen items-center bg-slate-900"
        >
          <div className="mx-auto max-w-5xl px-6 py-16">
            <p className="text-emerald-300 text-sm font-semibold uppercase tracking-[0.2em]">
              Use Cases
            </p>
            <h2 className="mt-2 text-3xl font-bold leading-tight">
              여수·광양항 실증에서 글로벌 확장까지
            </h2>
            <p className="mt-3 max-w-3xl text-slate-300">
              검증된 레퍼런스를 간결하게 보여주고, 해외 전시·MOU로 확장성을 확인했습니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-emerald-200">
              <span className="rounded-full border border-emerald-300/40 bg-emerald-300/5 px-3 py-1">
                신뢰도 96%
              </span>
              <span className="rounded-full border border-emerald-300/40 bg-emerald-300/5 px-3 py-1">
                시간 59% 단축
              </span>
              <span className="rounded-full border border-emerald-300/40 bg-emerald-300/5 px-3 py-1">
                데이터 2.1억건+
              </span>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "여수·광양항",
                  desc: "AIS 2.1억 건, 선박 2.2만척 데이터로 96% 신뢰도 검증",
                },
                {
                  title: "일본",
                  desc: "Japan IT Week 참가, 글로벌 바이어 대상 시연",
                },
                {
                  title: "우즈벡·중국",
                  desc: "MOU로 중앙아시아·중국 시장 기술 협력",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-slate-200/90">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200/90">
              {[
                "여수광양항만공사",
                "도선사회",
                "예선업협동조합",
                "전남정보문화산업진흥원",
                "Industry Insights LLC",
                "SAIIA",
              ].map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-white/10 px-3 py-1"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="snap-start flex min-h-screen items-center bg-slate-950"
        >
          <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-emerald-300 text-sm font-semibold uppercase tracking-[0.2em]">
                Contact
              </p>
              <h2 className="text-3xl font-bold leading-tight">
                CloudPort 도입 문의
              </h2>
              <p className="text-slate-300">
                기관/회사 정보를 남겨주시면 브로슈어와 데모 일정을 안내드립니다.
              </p>
              <div className="space-y-3 text-sm text-slate-200/90">
                <div>Tel: 000-0000-0000 / 000-0000-0000</div>
                <div>Email: contact@xxxxx.com / demo@xxxxx.com</div>
                <div>Address: xxxx xxxx 00, 0층 (xxxx, xxxx)</div>
              </div>
            </div>
            <form className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm space-y-1">
                  <span>이름/담당자</span>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                    placeholder="홍길동"
                  />
                </label>
                <label className="text-sm space-y-1">
                  <span>기관/회사</span>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                    placeholder="회사명"
                  />
                </label>
              </div>
              <label className="text-sm space-y-1">
                <span>이메일</span>
                <input
                  type="email"
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                  placeholder="you@example.com"
                />
              </label>
              <label className="text-sm space-y-1">
                <span>전화번호</span>
                <input
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                  placeholder="010-0000-0000"
                />
              </label>
              <label className="text-sm space-y-1">
                <span>문의 내용</span>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                  placeholder="도입 범위, 일정, 브로슈어 요청 등"
                />
              </label>
              <button
                type="button"
                className="w-full rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
              >
                문의 보내기
              </button>
            </form>
          </div>
        </section>

        <footer className="snap-start bg-slate-900">
          <div className="mx-auto max-w-5xl px-6 py-10 text-sm text-slate-300">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="font-semibold text-white">CloudPort</div>
              <div className="flex flex-wrap gap-3">
                <a className="hover:text-white" href="#hero">
                  Privacy Policy
                </a>
                <a className="hover:text-white" href="#hero">
                  Terms of Service
                </a>
                <a className="hover:text-white" href="#hero">
                  Contact
          </a>
        </div>
            </div>
            <div className="mt-4 space-y-1">
              <div>(주)회사명 | 사업자 000-00-00000</div>
              <div>대표 홍길동 | Tel 000-0000-0000 | Fax 000-0000-0000</div>
              <div>xxxx xxxx 00, 0층 (xxxx, xxxx)</div>
              <div>Email contact@xxxxx.com | www.example.com</div>
            </div>
            <div className="mt-4 text-xs text-slate-400">
              © 2025 iWorks Co., Ltd. All Rights Reserved.
            </div>
          </div>
        </footer>
      </main>

      <ChatbotWidget />
    </div>
  );
}
