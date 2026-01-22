"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChatbotWidget } from "./ChatbotWidget";

const navItems = [
  { id: "background", label: "Background" },
  { id: "solution", label: "Solution" },
  { id: "technology", label: "Technology" },
  { id: "benefit", label: "Benefit" },
  { id: "usecases", label: "Use Cases" },
];

type RevealVariant = "up" | "left" | "right" | "zoom" | "none";

type CSSVarProperties = React.CSSProperties & {
  [key: `--${string}`]: string | number;
};

type KV = { k: string; v: string };

const evidenceHighlights: Array<{ title: string; desc: string; footnote?: string }> = [
  {
    title: "도선사 자동 배정 신뢰도 96%",
    desc: "실증 이력 대비 자동배정 결과 일치율 기반",
  },
  {
    title: "업무 프로세스 운영시간 59% 단축",
    desc: "수작업 중심 프로세스의 전산화·자동화로 시간 절감",
  },
  {
    title: "여수‧광양항 체선율 23% (’21)",
    desc: "전국 평균 3.1% 대비 높은 대기 문제",
  },
];

const backgroundPainPoints: Array<{ title: string; bullets: string[]; stat?: string }> = [
  {
    title: "수작업 중심 배정·관제",
    bullets: [
      "경험 의존 배정으로 편차 발생, 휴먼에러 리스크 증가",
      "이상 상황 발생 시 조정 기준이 사람/조직별로 달라 의사결정 지연",
    ],
    stat: "프로세스 시간 단축 필요",
  },
  {
    title: "데이터 분절(사일로)",
    bullets: [
      "AIS·VTS·Port-MIS 등 핵심 데이터가 분리되어 실시간 통합 판단이 어려움",
      "보안/폐쇄적 정보망 특성으로 기관 간 공유·연계가 제한됨",
    ],
    stat: "통합 분석 부재",
  },
  {
    title: "비정형 변수 대응 한계",
    bullets: [
      "기상 특보/사고 보고/규정 변경 같은 텍스트 정보를 즉시 반영하기 어려움",
      "결과(가용/불가)에만 반응하고, 맥락/파급효과 추론과 선제 대응이 부족",
    ],
    stat: "Proactive 대응 필요",
  },
];

const nowTimeline = [
  { year: "2010", desc: "근무일지 기반 도·예선 스케줄 관리(초기 운영)" },
  { year: "2017", desc: "기초 시스템화(엑셀 등)로 관리 요소 데이터화" },
  { year: "2021", desc: "운영 시스템 구축(AIS 수집·분석 모듈, 빅데이터 기반)" },
  { year: "2025", desc: "AIS 위치 기반 스케줄 자동화·고도화 및 상용화 추진" },
];

const solutionProcess = [
  {
    step: "현행 운영·규정 분석",
    detail: [
      "도선법, 예선운영세칙, 변경 예규/내규 등 규정 검토",
      "도·예선 운영 프로세스/데이터 흐름을 정밀 분석해 개선 요구 도출",
    ],
  },
  {
    step: "데이터·아키텍처 설계",
    detail: [
      "AIS·VTS·Port-MIS + 도·예선 이력 + 선박·부두 재원 등 핵심 데이터 표준화",
      "ETL 파이프라인/분산 처리/DB·보안·시각화 아키텍처 설계",
    ],
  },
  {
    step: "자동배정·스케줄링 개발",
    detail: [
      "이동시간·누적업무량·피로도·자격/면허·우선순위 등 변수를 정의·수식화",
      "규정·제약조건을 반영한 스코어 기반 1차 배정 + 최적화/학습 기반 고도화",
    ],
  },
  {
    step: "성능 검증(백테스트/현장 검증)",
    detail: [
      "과거 배정 이력과 자동배정 결과 비교로 신뢰도 검증",
      "KPI(대기시간·체선율·업무편차 등)로 성능을 수치화하고 반복 개선",
    ],
  },
  {
    step: "운영 고도화·표준모델 확산",
    detail: [
      "현장 공동 검증으로 운영룰·화면·지표를 지속 보완",
      "타 항만/해외 확산 가능한 표준 운영모델 및 서비스 모델 정립",
    ],
  },
];

const techPillars: Array<{ title: string; desc: string; points: string[] }> = [
  {
    title: "규칙 기반 1차 배정(Baseline)",
    desc: "규정·제약조건을 반영한 스코어링으로 안정적 초안 배정 리스트 생성",
    points: [
      "변수 예: 이동시간(D), 누적업무량(W), 피로도(F), 자격/면허 적합(R), 선박 우선순위(P)",
      "Score = α·D + β·W + γ·F … (낮을수록 우선 배정) 형태로 운영",
    ],
  },
  {
    title: "강화학습 기반 가중치 자동 조정",
    desc: "배정 결과 데이터를 학습해 스코어 가중치를 자동 보정, 품질을 지속 개선",
    points: [
      "반복 학습으로 편차를 줄이고 공정 배분/대기 최소화 목표를 균형 있게 반영",
      "현장 운영룰 변화에 맞춰 파라미터를 점진적으로 최적화",
    ],
  },
  {
    title: "LLM 증강: 비정형 변수·규정 변경 대응",
    desc: "기상/사고/법령/내규 등 텍스트를 해석해 제약조건을 추출하고 배정안을 보정",
    points: [
      "정형(AIS/VTS/Port-MIS) + 비정형(특보/보고서/규정) 결합",
      "사후 대응(Reactive) → 선제적 회복탄력성(Proactive Resilience)으로 전환",
    ],
  },
  {
    title: "데이터 품질·보안(신뢰성 기반)",
    desc: "결측·이상치·중복 제거, 표준화/정규화, PII 비식별화 등 품질을 선행 확보",
    points: [
      "비정형 문서 텍스트 정제/토큰화/개체명 인식(NER) 및 이벤트 구조화(JSON)",
      "분산 처리 기반의 대용량 수집·전처리로 운영 수준 데이터셋을 구축",
    ],
  },
];

const benefitKpis: KV[] = [
  { k: "도선사 자동 배정 신뢰도", v: "96%" },
  { k: "업무 프로세스 운영시간 단축", v: "59%" },
  { k: "체선율(여수‧광양항)", v: "23% (‘21) / 전국 3.1%" },
  { k: "AI 신뢰성 검증", v: "적합" },
  { k: "데이터 확보", v: "항만 운영 데이터 50,000건+" },
];

const quantifiedOutcomes: Array<{ title: string; items: string[] }> = [
  {
    title: "사업 수행 정량 성과",
    items: [
      "과제 관련 매출 44.4억 원",
      "신규 고용 5명",
      "특허/지재권 및 SW 등록 성과(복수 건) 확보",
      "해외 전시/협력(MOU) 추진으로 글로벌 확산 기반 마련",
    ],
  },
  {
    title: "품질·운영 관리 체계",
    items: [
      "진도관리/위험관리/형상관리/인력관리 체계화 및 정례 회의 운영",
      "전문가(MP) 컨설팅/리스크 분석·대응계획 수립으로 일정·품질 관리",
      "현장(도선사회·예선사·항만공사) 의견 반영을 통한 운영룰·UI 반복 개선",
    ],
  },
];

const useCases: Array<{ title: string; situation: string; whatWeDo: string[] }> = [
  {
    title: "일상 운영(정상 입·출항)",
    situation: "입출항/이접안/계류를 고려해 도·예선 배정과 당직표를 안정적으로 운영",
    whatWeDo: [
      "통합 데이터 기반 스케줄 가시화 및 지표 산출",
      "규정 기반 자동 배정과 후보군 비교·검증",
      "운영자 판단을 위한 설명(근거/제약조건) 제공",
    ],
  },
  {
    title: "기상이변(태풍·짙은 안개)",
    situation: "항만 폐쇄·작업 중단으로 대규모 체선이 발생할 수 있는 상황",
    whatWeDo: [
      "특보/매뉴얼 텍스트를 해석해 영향 구간·시간대를 반영",
      "재스케줄링 시나리오를 제시하고 우선순위 재조정",
      "대기 최소화·안전 우선 원칙으로 배정안 업데이트",
    ],
  },
  {
    title: "사고·장비고장(선석 운영 중단)",
    situation: "충돌/장비 고장 등으로 특정 선석이 일정 시간 사용 불가",
    whatWeDo: [
      "사고 보고서에서 중단 범위/예상 기간 등 핵심 정보를 추출",
      "파급효과(대기·혼잡·자원 부족)를 반영해 대체 배정안 생성",
      "현장 판단과의 일치 여부를 사례 기반으로 검증·개선",
    ],
  },
  {
    title: "법령·세칙·내규 변경",
    situation: "운영 제약조건이 바뀌면 기존 배정이 즉시 규정 위반이 될 수 있음",
    whatWeDo: [
      "규정 텍스트에서 금지/필수/예외 조건을 자동 식별",
      "1차 배정 결과의 유효성 검증 후 위반 건을 선별",
      "차순위 후보군으로 조정하거나 보류 등 합리적 대안 제안",
    ],
  },
  {
    title: "확산/표준모델 적용",
    situation: "타 항만·해외 항만으로 확산 가능한 운영 표준과 서비스 모델 필요",
    whatWeDo: [
      "실증 결과와 지표를 기반으로 표준 운영모델 정리",
      "패키지형/클라우드 서비스형 도입 옵션 제시",
      "현장 협업 구조(항만공사·도선사회·대학 등) 기반 확산",
    ],
  },
  {
    title: "데이터 품질/보안 요구가 높은 환경",
    situation: "보안·규정 준수가 중요한 항만 특성상 데이터 품질과 통제가 핵심",
    whatWeDo: [
      "표준화/정규화, 중복·결측·이상치 처리로 데이터 신뢰성 확보",
      "개인식별정보(PII) 비식별화 등 보안 요건 반영",
      "검증 가능한 로그/지표 중심 운영으로 감사 대응력 강화",
    ],
  },
];

function SectionTitle({
  kicker,
  title,
  desc,
  align = "left",
}: {
  kicker: string;
  title: string;
  desc?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`space-y-2 ${align === "center" ? "text-center" : ""}`}>
      <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.2em]">
        {kicker}
      </p>
      <h2 className="text-2xl font-bold leading-snug md:text-3xl 2xl:text-[28px]">
        {title}
      </h2>
      {desc ? (
        <p className="text-sm text-slate-300 md:text-base 2xl:text-[13.5px] max-w-none">
          {desc}
        </p>
      ) : null}
    </div>
  );
}

function List({
  items,
  tone = "default",
}: {
  items: string[];
  tone?: "default" | "muted";
}) {
  return (
    <ul
      className={`space-y-1 text-xs md:text-sm 2xl:text-[13px] ${
        tone === "muted" ? "text-slate-300" : "text-slate-200/90"
      }`}
    >
      {items.map((t) => (
        <li key={t} className="flex gap-2">
          <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300/80" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Reveal({
  children,
  delay = 0,
  variant = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  variant?: RevealVariant;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const root = (el.closest("main") as Element | null) ?? null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { root, threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    // Ensure initial styles are committed before observation triggers.
    requestAnimationFrame(() => io.observe(el));
    return () => io.disconnect();
  }, []);

  const style: CSSVarProperties = { transitionDelay: `${delay}ms` };
  if (variant === "up") style["--reveal-y"] = "18px";
  if (variant === "left") style["--reveal-x"] = "-20px";
  if (variant === "right") style["--reveal-x"] = "20px";
  if (variant === "zoom") style["--reveal-s"] = "0.985";
  if (variant === "none") {
    style["--reveal-x"] = "0px";
    style["--reveal-y"] = "0px";
    style["--reveal-s"] = "1";
  }

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sticky Header */}
      <header className="fixed inset-x-0 top-0 z-30 bg-slate-950/40 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto flex max-w-7xl 2xl:max-w-[1480px] items-center justify-between px-8 2xl:px-10 py-3">
          <Image
            src="/image/logo.png"
            alt="회사 로고"
            width={260}
            height={72}
            priority
            className="h-10 md:h-11 w-auto"
          />
          <nav className="hidden items-center gap-10 text-sm font-medium md:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sky-300 hover:text-white transition-transform transition-colors duration-200 hover:scale-105"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <a
              href="#contact"
              className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-blue-400 transition-colors"
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
          className="snap-start relative flex min-h-screen 2xl:h-screen items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_35%)]" />
          <div className="relative z-10 mx-auto flex max-w-7xl 2xl:max-w-[1480px] flex-col items-center gap-6 px-8 2xl:px-10 text-center">
            <Reveal variant="up" delay={0}>
              <p className="text-sky-300 text-sm font-semibold uppercase tracking-[0.2em]">
                LLM 기반 실시간 변수 대응형 지능형 항만 운영 시스템
              </p>
            </Reveal>
            <Reveal variant="up" delay={80}>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                항만의 모든 변수를 예측하다,
                <br />
                iWorks AI 스케줄링
              </h1>
            </Reveal>
            <Reveal variant="up" delay={160}>
              <p className="max-w-5xl text-base md:text-lg 2xl:text-[15px] text-slate-200/90">
                AIS·VTS·Port-MIS 등 정형 데이터와 기상·사고·규정 등 비정형 텍스트를 통합 분석해
                도선·예선 배정을 자동화합니다. 실증 결과 기반으로 운영 프로세스 시간을 59%까지 단축한
                근거 중심 플랫폼입니다.
              </p>
            </Reveal>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-sky-200">
              {[
                "실증: 여수·광양항",
                "정형+비정형 통합",
                "규정 준수형 자동배정",
              ].map((t, idx) => (
                <Reveal key={t} variant="zoom" delay={180 + idx * 60}>
                  <span className="rounded-full border border-sky-300/40 bg-sky-300/5 px-3 py-1">
                    {t}
                  </span>
                </Reveal>
              ))}
            </div>
            <div className="grid w-full max-w-5xl gap-3 md:grid-cols-3">
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
              ].map((item, idx) => (
                <Reveal key={item.title} variant="up" delay={220 + idx * 70}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left shadow-lg backdrop-blur">
                    <div className="text-sm text-sky-300">{item.desc}</div>
                    <div className="mt-1 text-2xl font-bold">{item.title}</div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal variant="up" delay={320}>
              <div className="w-full max-w-6xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-5 2xl:p-4 text-left">
                <div className="text-sm font-semibold text-white">핵심 근거 요약</div>
                <div className="mt-3 grid gap-3 md:grid-cols-3 2xl:gap-2">
                  {evidenceHighlights.map((e) => (
                    <div key={e.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="font-semibold text-sky-200">{e.title}</div>
                      <div className="mt-1 text-sm text-slate-200/90">{e.desc}</div>
                      {e.footnote ? (
                        <div className="mt-2 text-xs text-slate-400">{e.footnote}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <div className="mt-8 flex justify-center">
              <Reveal variant="zoom" delay={320}>
                <a
                  href="#background"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-sky-400/40 bg-sky-400/10 shadow-[0_0_30px_rgba(59,130,246,0.25)] animate-bounce transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-300/70"
                  aria-label="배경 섹션으로 이동"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-sky-300"
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
              </Reveal>
            </div>
          </div>
        </section>

        <section
          id="background"
          className="snap-start flex min-h-screen 2xl:h-screen items-center bg-slate-900"
        >
          <div className="mx-auto grid max-w-7xl 2xl:max-w-[1480px] gap-6 px-8 2xl:px-10 py-10 2xl:py-8 md:grid-cols-2 md:items-center">
            <Reveal variant="left" delay={0}>
              <div className="space-y-4">
                <SectionTitle
                  kicker="Background"
                  title="한계에 도달한 수작업 항만 운영, 근거 기반 혁신이 필요합니다."
                  desc="여수‧광양항 등 주요 항만은 혼잡과 대기 문제, 데이터 분절, 비정형 변수(기상/사고/규정) 대응 한계를 동시에 겪고 있습니다. iWorks는 현장의 규정과 데이터를 기반으로 이 문제를 정량화하고 해결합니다."
                />
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm font-semibold text-white">Why Now</div>
                  <div className="mt-3 grid gap-3">
                    <div className="rounded-xl border border-white/10 bg-slate-950/30 p-4">
                      <div className="text-sm text-sky-300">체선율(대기 문제)</div>
                      <div className="mt-1 text-lg font-bold">여수‧광양항 23% vs 전국 평균 3.1%</div>
                      <div className="mt-1 text-sm text-slate-200/90">
                        선박이 입항을 위해 12시간 이상 항만 밖에서 대기하는 비율
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-slate-950/30 p-4">
                      <div className="text-sm text-sky-300">운영 데이터 통합 필요</div>
                      <div className="mt-1 text-sm text-slate-200/90">
                        AIS·VTS·Port-MIS 등 이종 데이터의 연계/표준화/분석 부재는 실시간 판단을
                        어렵게 만들며, 수작업 중심 운영의 비효율을 고착화합니다.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal variant="right" delay={80}>
              <div className="grid gap-3 2xl:grid-cols-2 2xl:items-start">
                <div className="grid gap-3">
                  {backgroundPainPoints.map((item, idx) => (
                    <Reveal
                      key={item.title}
                      variant={idx % 2 === 0 ? "right" : "up"}
                      delay={120 + idx * 70}
                    >
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 2xl:p-4 shadow-lg backdrop-blur">
                        {item.stat ? <div className="text-xs text-sky-300">{item.stat}</div> : null}
                        <h3 className="mt-1 text-lg 2xl:text-[16px] font-semibold">{item.title}</h3>
                        <div className="mt-2">
                          <List items={item.bullets} />
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
                <Reveal variant="up" delay={340}>
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-5 2xl:p-4">
                    <div className="text-sm font-semibold text-white">운영 진화 타임라인</div>
                    <div className="mt-3 space-y-2">
                      {nowTimeline.map((t) => (
                        <div
                          key={t.year}
                          className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 2xl:p-3"
                        >
                          <div className="w-14 shrink-0 text-sky-300 font-bold">{t.year}</div>
                          <div className="text-xs md:text-sm 2xl:text-[13px] text-slate-200/90">{t.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="solution"
          className="snap-start flex min-h-screen 2xl:h-screen items-center bg-slate-950"
        >
          <div className="mx-auto max-w-7xl 2xl:max-w-[1480px] px-8 2xl:px-10 py-10 2xl:py-8">
            <Reveal variant="up" delay={0}>
              <SectionTitle
                kicker="Solution"
                title="iWorks: 데이터 통합 → 규정 준수형 자동 배정 → LLM 기반 변수 대응"
                desc="도·예선 운영의 핵심은 '규정 준수'와 '현장 변수 대응'입니다. iWorks는 운영 데이터를 표준화·통합하고, 규칙 기반 배정과 검증(백테스트/현장 공동 검증)을 통해 신뢰 가능한 자동화를 제공합니다."
              />
            </Reveal>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
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
              ].map((item, idx) => (
                <Reveal
                  key={item.title}
                  variant={idx === 0 ? "left" : idx === 1 ? "up" : "right"}
                  delay={180 + idx * 90}
                >
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-5 2xl:p-4 shadow-lg">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="mt-2 text-slate-200/90">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-10 grid gap-4">
              <Reveal variant="up" delay={160}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 2xl:p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div className="text-lg font-semibold">추진 프로세스</div>
                    <div className="text-xs text-slate-400">
                      규정 분석 → 데이터 통합 → 자동배정 → 검증(백테스트/현장) → 고도화/확산
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 2xl:grid-cols-2">
                    {solutionProcess.map((p, i) => (
                      <div key={p.step} className="rounded-xl border border-white/10 bg-slate-950/30 p-4 2xl:p-3">
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-sm text-sky-300 font-semibold">Step {i + 1}</div>
                        </div>
                        <div className="mt-2 text-lg font-bold">{p.step}</div>
                        <div className="mt-3">
                          <List items={p.detail} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section
          id="technology"
          className="snap-start flex min-h-screen 2xl:h-screen items-center bg-slate-900"
        >
          <div className="mx-auto max-w-7xl 2xl:max-w-[1480px] px-8 2xl:px-10 py-10 2xl:py-8">
            <Reveal variant="left" delay={0}>
              <SectionTitle
                kicker="Technology"
                title="Core Technology: 규칙 기반 안정성 + 학습 기반 최적화 + LLM 회복탄력성"
                desc="공공/현장 도입에서 중요한 것은 '설명 가능성'과 '규정 준수'입니다. iWorks는 규칙 기반 1차 배정으로 안전한 기준선을 만들고, 학습/LLM로 운영 변수를 반영해 지속적으로 고도화합니다."
              />
            </Reveal>
            <div className="mt-6 grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
              {techPillars.map((item, idx) => (
                <Reveal
                  key={item.title}
                  variant={idx % 2 === 0 ? "left" : "right"}
                  delay={140 + idx * 80}
                >
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 2xl:p-4 shadow-lg">
                    <h3 className="text-xl font-semibold text-sky-300">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-slate-200/90">{item.desc}</p>
                    <div className="mt-4">
                      <List items={item.points} tone="muted" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200/90">
              {[
                "특허: 데이터 기반 도선사 자동 배정",
                "특허: AIS/VTS 융합 스케줄 관리",
                "AI 신뢰성 검증 적합",
                "SW 저작권 등록",
              ].map((tag, idx) => (
                <Reveal key={tag} variant="zoom" delay={120 + idx * 60}>
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {tag}
                  </span>
                </Reveal>
              ))}
            </div>
            <Reveal variant="up" delay={240}>
              <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 2xl:p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div className="text-lg font-semibold">운영 신뢰성 확보 전략(요약)</div>
                  <div className="text-xs text-slate-400">공공 도입 관점의 검증/통제 포인트</div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[
                    {
                      title: "규정 준수",
                      items: ["도선법/예선 세칙/내규 등 제약조건을 로직에 반영", "위반 가능성 자동 검토 및 변경 제안"],
                    },
                    {
                      title: "검증 가능성",
                      items: ["과거 배정 이력 기반 백테스트", "KPI(대기/체선/편차)로 수치 검증"],
                    },
                    {
                      title: "운영 통제",
                      items: ["근거(점수 요소/제약조건) 제공", "운영자 승인/조정 흐름으로 단계적 적용"],
                    },
                  ].map((b) => (
                    <div key={b.title} className="rounded-xl border border-white/10 bg-white/5 p-4 2xl:p-3">
                      <div className="font-semibold text-sky-200">{b.title}</div>
                      <div className="mt-3">
                        <List items={b.items} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="benefit"
          className="snap-start flex min-h-screen 2xl:h-screen items-center bg-slate-950"
        >
          <div className="mx-auto max-w-7xl 2xl:max-w-[1480px] px-8 2xl:px-10 py-10 2xl:py-8">
            <Reveal variant="right" delay={0}>
              <SectionTitle
                kicker="Benefit"
                title="데이터로 증명된 성과: 지표·검증·확산 계획까지"
                desc="iWorks는 실증 데이터와 백테스트, 현장 공동 검증을 통해 신뢰 가능한 자동배정을 구현했습니다."
              />
            </Reveal>

            {/* default layout (stacked) */}
            <div className="2xl:hidden">
              <div className="mt-8 grid gap-4 md:grid-cols-4">
                {[
                  { title: "59% 단축", desc: "업무 프로세스 운영 시간" },
                  { title: "96% 신뢰도", desc: "도선사 자동 배정 정확도" },
                  { title: "체선율 감소", desc: "대기 비용·물류비 절감" },
                  { title: "신뢰성 검증", desc: "AI 적합 판정 완료" },
                ].map((item, idx) => (
                  <Reveal key={item.title} variant="up" delay={140 + idx * 70}>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center shadow-lg">
                      <div className="text-2xl font-bold text-sky-300">
                        {item.title}
                      </div>
                      <p className="mt-2 text-slate-200/90">{item.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal variant="up" delay={220}>
                <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="text-lg font-semibold">핵심 KPI</div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {benefitKpis.map((x) => (
                      <div key={x.k} className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/30 p-4">
                        <div className="text-sm text-slate-200/90">{x.k}</div>
                        <div className="text-sm font-semibold text-sky-200 text-right">{x.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-slate-400">
                    ※ 수치는 첨부 문서(사업결과보고서/요약서/프로젝트 신청서 등) 기반으로 요약 표기되었습니다.
                  </div>
                </div>
              </Reveal>
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {[
                  { title: "경제성", desc: "체선율 감소로 비용 절감, 회전율 향상" },
                  { title: "안전", desc: "휴먼에러 저감, 위험 요인 선제 감지" },
                  { title: "환경", desc: "공회전 감소로 연료·탄소 절감" },
                  { title: "확장성", desc: "데이터 기반 정책·해외 확장 지원" },
                ].map((item, idx) => (
                  <Reveal
                    key={item.title}
                    variant={idx % 2 === 0 ? "left" : "right"}
                    delay={120 + idx * 80}
                  >
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="mt-2 text-slate-200/90">{item.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {quantifiedOutcomes.map((b, idx) => (
                  <Reveal key={b.title} variant={idx === 0 ? "left" : "right"} delay={180 + idx * 90}>
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6">
                      <div className="text-lg font-semibold text-white">{b.title}</div>
                      <div className="mt-4">
                        <List items={b.items} />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* 2xl layout (fits 1920x1080 as one screen) */}
            <div className="hidden 2xl:grid 2xl:grid-cols-12 gap-3 mt-6">
              <div className="2xl:col-span-4 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">핵심 KPI</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {[
                      { title: "59% 단축", desc: "업무 프로세스 운영 시간" },
                      { title: "96% 신뢰도", desc: "도선사 자동 배정 정확도" },
                      { title: "체선율", desc: "대기 문제 지표" },
                      { title: "신뢰성", desc: "AI 적합 판정" },
                    ].map((i) => (
                      <div key={i.title} className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
                        <div className="text-sm font-bold text-sky-200">{i.title}</div>
                        <div className="mt-1 text-xs text-slate-300">{i.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">KPI 상세</div>
                  <div className="mt-3 grid gap-2">
                    {benefitKpis.map((x) => (
                      <div
                        key={x.k}
                        className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/30 p-3"
                      >
                        <div className="text-xs text-slate-200/90">{x.k}</div>
                        <div className="text-xs font-semibold text-sky-200 text-right">{x.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="2xl:col-span-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">기대 효과</div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { title: "경제성", desc: "체선율 감소로 비용 절감, 회전율 향상" },
                    { title: "안전", desc: "휴먼에러 저감, 위험 요인 선제 감지" },
                    { title: "환경", desc: "공회전 감소로 연료·탄소 절감" },
                    { title: "확장성", desc: "데이터 기반 정책·해외 확장 지원" },
                  ].map((b) => (
                    <div key={b.title} className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
                      <div className="text-sm font-semibold text-slate-100">{b.title}</div>
                      <div className="mt-1 text-xs text-slate-300">{b.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="2xl:col-span-4 grid gap-3">
                {quantifiedOutcomes.map((b) => (
                  <div key={b.title} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4">
                    <div className="text-sm font-semibold text-white">{b.title}</div>
                    <div className="mt-3">
                      <List items={b.items} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="usecases"
          className="snap-start flex min-h-screen 2xl:h-screen items-center bg-slate-900"
        >
          <div className="mx-auto max-w-7xl 2xl:max-w-[1480px] px-8 2xl:px-10 py-10 2xl:py-8">
            <Reveal variant="left" delay={0}>
              <SectionTitle
                kicker="Use Cases"
                title="운영 시나리오 기반 적용: 정상·돌발·규정 변경까지"
                desc="실제 항만 운영은 예측 가능한 폐쇄 시스템이 아니라, 끊임없는 변화와 불확실성이 있는 환경입니다. iWorks는 정형+비정형 데이터를 결합해 선제적 대응을 지원합니다."
              />
            </Reveal>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-sky-200">
              {["신뢰도 96%", "시간 59% 단축", "데이터 2.1억건+"].map((t, idx) => (
                <Reveal key={t} variant="zoom" delay={160 + idx * 70}>
                  <span className="rounded-full border border-sky-300/40 bg-sky-300/5 px-3 py-1">
                    {t}
                  </span>
                </Reveal>
              ))}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {useCases.map((u, idx) => (
                <Reveal key={u.title} variant={idx % 2 === 0 ? "left" : "right"} delay={160 + idx * 70}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 2xl:p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-lg 2xl:text-[16px] font-semibold">{u.title}</h3>
                    </div>
                    <p className="mt-2 text-xs md:text-sm 2xl:text-[13px] text-slate-200/90">{u.situation}</p>
                    <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/30 p-4 2xl:p-3">
                      <div className="mt-2">
                        <List items={u.whatWeDo} />
                      </div>
                    </div>
                  </div>
                </Reveal>
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
              ].map((p, idx) => (
                <Reveal key={p} variant="zoom" delay={80 + idx * 55}>
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {p}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="snap-start flex min-h-screen 2xl:h-screen items-center bg-slate-950"
        >
          <div className="mx-auto grid max-w-7xl 2xl:max-w-[1480px] gap-6 px-8 2xl:px-10 py-10 2xl:py-8 md:grid-cols-[1.1fr_0.9fr]">
            <Reveal variant="left" delay={0}>
              <div className="space-y-4">
                <p className="text-sky-300 text-sm font-semibold uppercase tracking-[0.2em]">
                  Contact
                </p>
                <h2 className="text-3xl font-bold leading-tight">
                  iWorks 도입 문의
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
            </Reveal>
            <Reveal variant="right" delay={80}>
              <form className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6 2xl:p-4 shadow-lg">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm space-y-1">
                  <span>이름/담당자</span>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
                    placeholder="고재우"
                  />
                </label>
                <label className="text-sm space-y-1">
                  <span>기관/회사</span>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
                    placeholder="회사명"
                  />
                </label>
              </div>
              <label className="text-sm space-y-1">
                <span>이메일</span>
                <input
                  type="email"
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
                  placeholder="you@example.com"
                />
              </label>
              <label className="text-sm space-y-1">
                <span>전화번호</span>
                <input
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
                  placeholder="010-0000-0000"
                />
              </label>
              <label className="text-sm space-y-1">
                <span>문의 내용</span>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
                  placeholder="도입 범위, 일정, 브로슈어 요청 등"
                />
              </label>
              <button
                type="button"
                className="w-full rounded-full bg-blue-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-blue-400 transition-colors"
              >
                문의 보내기
              </button>
              </form>
            </Reveal>
          </div>
        </section>

        <footer className="snap-start bg-slate-900">
          <div className="mx-auto max-w-5xl px-6 py-10 text-sm text-slate-300">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <a href="#hero" className="inline-flex items-center">
                <Image
                  src="/image/logo.png"
                  alt="회사 로고"
                  width={240}
                  height={60}
                  className="h-10 md:h-11 w-auto"
                />
              </a>
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
              <div>(주)아이웍스 | 사업자 000-00-00000</div>
              <div>대표 홍길동 | Tel 000-0000-0000 | Fax 000-0000-0000</div>
              <div>xxxx xxxx 00, 0층 (xxxx, xxxx)</div>
              <div>Email contact@xxxxx.com | www.example.com</div>
            </div>
            <div className="mt-4 text-xs text-slate-400">
              © 2026. All Rights Reserved.
            </div>
          </div>
        </footer>
      </main>

      <ChatbotWidget />
    </div>
  );
}
