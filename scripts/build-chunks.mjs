import fs from "node:fs";
import path from "node:path";
import pdf from "pdf-parse";

const DOCS_DIR = path.resolve("public/docs");
const OUT_DIR = path.resolve("public/docs/rag");
const OUT_FILE = path.join(OUT_DIR, "chunks.json");

// 청킹 파라미터(필요하면 조절)
const CHUNK_MAX_CHARS = 900; // 한국어 기준 600~1000 추천
const CHUNK_OVERLAP = 150;   // 100~200 추천
const MIN_CHUNK_CHARS = 120; // 너무 짧은 조각 제거

function normalizeText(s) {
  return (s ?? "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

// PDF에서 흔히 생기는 반복 헤더/푸터/쪽번호 같은 "반복 라인"을 대충 제거하는 휴리스틱
function stripRepeatedLines(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 50) return text;

  const counts = new Map();
  for (const l of lines) {
    // 너무 짧은 라인은 의미 없는 경우가 많아서 스킵
    if (l.length < 4) continue;
    counts.set(l, (counts.get(l) ?? 0) + 1);
  }

  // 전체 라인 수 대비 너무 자주 등장하는 라인은 제거 후보로 본다.
  // (문서 전체에 걸쳐 8회 이상 등장하면 거의 헤더/푸터일 가능성이 큼)
  const repeated = new Set(
    [...counts.entries()]
      .filter(([l, c]) => c >= 8 && l.length <= 80)
      .map(([l]) => l)
  );

  if (repeated.size === 0) return text;

  const cleaned = text
    .split("\n")
    .filter((l) => !repeated.has(l.trim()))
    .join("\n");
  return cleaned;
}

function splitIntoParagraphs(text) {
  const t = normalizeText(text);
  if (!t) return [];
  // 빈 줄 기준으로 문단 나누기
  return t.split(/\n\s*\n/g).map((p) => p.trim()).filter(Boolean);
}

function makeChunksFromParagraphs(paragraphs) {
  const chunks = [];
  let buf = "";

  const flush = () => {
    const v = buf.trim();
    if (v.length >= MIN_CHUNK_CHARS) chunks.push(v);
    buf = "";
  };

  for (const p of paragraphs) {
    // 너무 긴 문단은 강제로 잘라야 함
    if (p.length > CHUNK_MAX_CHARS) {
      // 현재 버퍼 먼저 flush
      flush();
      for (let i = 0; i < p.length; i += (CHUNK_MAX_CHARS - CHUNK_OVERLAP)) {
        const piece = p.slice(i, i + CHUNK_MAX_CHARS).trim();
        if (piece.length >= MIN_CHUNK_CHARS) chunks.push(piece);
      }
      continue;
    }

    // 버퍼에 추가했을 때 max를 넘으면 flush 후 새로 시작
    const candidate = buf ? `${buf}\n\n${p}` : p;
    if (candidate.length <= CHUNK_MAX_CHARS) {
      buf = candidate;
    } else {
      // overlap: 이전 buf의 뒤쪽 일부를 다음 chunk에 붙여 문맥 유지
      const prev = buf.trim();
      flush();
      const overlapTail = prev.slice(Math.max(0, prev.length - CHUNK_OVERLAP)).trim();
      buf = overlapTail ? `${overlapTail}\n\n${p}` : p;
    }
  }
  flush();
  return chunks;
}

async function extractTextFromPdf(pdfPath) {
  const buf = fs.readFileSync(pdfPath);
  const data = await pdf(buf);
  let text = normalizeText(data.text);
  text = stripRepeatedLines(text);
  return normalizeText(text);
}

async function main() {
  if (!fs.existsSync(DOCS_DIR)) throw new Error(`Missing docs dir: ${DOCS_DIR}`);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const entries = fs.readdirSync(DOCS_DIR, { withFileTypes: true });
  const pdfFiles = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".pdf"))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  if (pdfFiles.length === 0) throw new Error("No PDF files found under public/docs");

  const all = [];

  for (const name of pdfFiles) {
    const fullPath = path.join(DOCS_DIR, name);
    const docId = name.replace(/\.pdf$/i, "");

    console.log(`- reading ${name} ...`);
    let text = "";
    try {
      text = await extractTextFromPdf(fullPath);
    } catch (e) {
      console.warn(`  ! failed to parse ${name}:`, e?.message ?? e);
      continue;
    }

    const paragraphs = splitIntoParagraphs(text);
    const chunks = makeChunksFromParagraphs(paragraphs);

    console.log(`  -> paragraphs=${paragraphs.length}, chunks=${chunks.length}`);
    for (let i = 0; i < chunks.length; i++) {
      all.push({
        id: `${docId}-${String(i).padStart(4, "0")}`,
        docId,
        text: chunks[i],
      });
    }
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(all, null, 2), "utf8");
  console.log(`\nWrote ${all.length} chunks -> ${OUT_FILE}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

