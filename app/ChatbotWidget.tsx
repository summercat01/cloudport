"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { CreateMLCEngine, type MLCEngine } from "@mlc-ai/web-llm";

type Chunk = { id: string; docId: string; text: string };

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
}

function hasWebGPU() {
  return typeof navigator !== "undefined" && !!(navigator as any).gpu;
}

function tokenize(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2);
}

// 1차 MVP: 키워드 포함 기반 top-k 검색(가볍고 안정적)
function searchTopK(chunks: Chunk[], question: string, k = 5) {
  const qTokens = tokenize(question);
  const qSet = new Set(qTokens);

  const scored = chunks.map((c) => {
    const text = c.text.toLowerCase();
    let score = 0;
    for (const w of qSet) {
      if (text.includes(w)) score += 1;
    }
    return { c, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.c);
}

export function ChatbotWidget() {
  const [blocked, setBlocked] = useState(false);
  const [noWebGPU, setNoWebGPU] = useState(false);
  const [open, setOpen] = useState(false);

  const [chunks, setChunks] = useState<Chunk[] | null>(null);
  const [engine, setEngine] = useState<MLCEngine | null>(null);

  const [loadingModel, setLoadingModel] = useState(false);
  const [modelProgress, setModelProgress] = useState<string>("");

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([{ role: "assistant", content: "문서 기반으로 답변해드릴게요. 질문을 입력하세요. 초기 로딩이 오래 걸립니다." }]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  useEffect(() => {
    setBlocked(isMobileDevice());
    setNoWebGPU(!hasWebGPU());
  }, []);

  // 모바일 차단(사이트는 그대로, 챗봇만 비활성)
  if (blocked) {
    return (
      <div className="fixed bottom-6 right-6 z-40 w-[360px] rounded-2xl border border-white/10 bg-slate-950/90 p-4 text-slate-100 shadow-2xl">
        <div className="text-sm font-semibold">챗봇은 PC에서만 이용 가능합니다</div>
        <div className="mt-1 text-xs text-slate-300">
          문서 기반 요약 답변 기능은 데스크탑(Chrome/Edge 권장)에서 제공됩니다.
        </div>
      </div>
    );
  }

  // WebGPU 없으면 안내(데스크탑이어도 발생 가능)
  if (noWebGPU) {
    return (
      <div className="fixed bottom-6 right-6 z-40 w-[360px] rounded-2xl border border-white/10 bg-slate-950/90 p-4 text-slate-100 shadow-2xl">
        <div className="text-sm font-semibold">WebGPU 미지원</div>
        <div className="mt-1 text-xs text-slate-300">
          이 브라우저에서는 WebLLM 실행이 어렵습니다. Chrome/Edge 최신 버전에서 다시 시도해주세요.
        </div>
      </div>
    );
  }

  // chunks.json 로드
  useEffect(() => {
    (async () => {
      const r = await fetch("/docs/rag/chunks.json", { cache: "force-cache" });
      const data = (await r.json()) as Chunk[];
      setChunks(Array.isArray(data) ? data : []);
    })().catch(() => setChunks([]));
  }, []);

  // 모델 로드(WebLLM) - "열었을 때"만 로딩해서 체감 대기 최소화
  useEffect(() => {
    if (!open) return;
    if (engine) return;
    if (!chunks) return;
    if (chunks.length === 0) return;

    (async () => {
      setLoadingModel(true);

      // 2분 이내 로딩 목표: 8B -> 3B(기본) / 실패 시 1B로 폴백
      const primary = "Llama-3.2-3B-Instruct-q4f16_1-MLC";
      const fallback = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

      const mk = async (model: string) =>
        CreateMLCEngine(model, {
          initProgressCallback: (p) => setModelProgress(p.text ?? ""),
        });

      let e: MLCEngine | null = null;
      try {
        e = await mk(primary);
      } catch {
        setModelProgress("기본 모델 로드 실패, 더 작은 모델로 재시도 중…");
        e = await mk(fallback);
      }

      setEngine(e);
      setLoadingModel(false);
      setModelProgress("");
    })().catch(() => {
      setEngine(null);
      setLoadingModel(false);
      setModelProgress("모델 로드 실패");
    });
  }, [open, chunks, engine]);

  const canSend = useMemo(() => {
    return !!engine && !!chunks && input.trim().length > 0 && !loadingModel;
  }, [engine, chunks, input, loadingModel]);

  async function onSend() {
    if (!engine || !chunks) return;
    const question = input.trim();
    if (!question) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: question }, { role: "assistant", content: "" }]);

    // 컨텍스트를 너무 길게 넣으면 느려지고 환각 가능성이 늘어날 수 있어 top-k를 제한
    const top = searchTopK(chunks, question, 4);
    const context = top.map((c, i) => `[#${i + 1}]\n${c.text}`).join("\n\n");

    const prompt = [
      "너는 제공된 CONTEXT에만 근거해서 답하는 문서 Q&A 봇이다.",
      "CONTEXT에 없는 내용은 추측하지 말고 '문서에 근거가 없어 답할 수 없습니다'라고 말해라.",
      "답변은 한국어로 자연스럽게 요약해서 작성해라.",
      "",
      "CONTEXT:",
      context,
      "",
      "QUESTION:",
      question,
    ].join("\n");

    const stream = await engine.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 400,
      stream: true,
    });

    let out = "";
    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content ?? "";
      if (!delta) continue;
      out += delta;
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: out };
        return copy;
      });
    }
  }

  // 닫힌 상태(버튼만) - 클릭 시 open=true로 전환하면서 모델 로딩 시작
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-[0_0_40px_rgba(16,185,129,0.45)] ring-1 ring-emerald-200/40 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-200/70 active:scale-100"
        aria-label="문서 기반 챗봇 열기"
      >
        <span
          aria-hidden="true"
          className="grid h-7 w-7 place-items-center rounded-full bg-slate-950/15 ring-1 ring-white/30"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22a9 9 0 1 0-9-9" />
            <path d="M12 13a3 3 0 1 0-3-3" />
            <path d="M3 22l3-3" />
          </svg>
        </span>
        <span>챗봇</span>
        <span className="ml-1 rounded-full bg-slate-950/15 px-2 py-1 text-[11px] font-bold tracking-tight ring-1 ring-white/25">
          BETA
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-[380px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/90 text-slate-100 shadow-2xl">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">챗봇</div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-200 hover:bg-white/10"
          >
            닫기
          </button>
        </div>
        {loadingModel ? (
          <div className="mt-1 text-xs text-slate-300">모델 로딩 중… {modelProgress}</div>
        ) : engine ? (
          <div className="mt-1 text-xs text-slate-300">준비됨</div>
        ) : (
          <div className="mt-1 text-xs text-slate-300">초기화 중…</div>
        )}
      </div>

      <div className="h-[360px] overflow-y-auto px-4 py-3">
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.role === "user" ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block max-w-[90%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                m.role === "user" ? "bg-emerald-500 text-slate-950" : "bg-white/10 text-slate-100"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSend();
            }}
            className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-400"
            placeholder="질문을 입력하세요"
          />
          <button
            onClick={onSend}
            disabled={!canSend}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}

