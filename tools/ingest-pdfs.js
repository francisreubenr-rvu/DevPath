const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const repoRoot = path.resolve(__dirname, '..');
const sourceRoots = [path.join(repoRoot, 'f Sem 1'), path.join(repoRoot, 'f Sem 2')];
const model = JSON.parse(fs.readFileSync(path.join(__dirname, 'content-model.json'), 'utf8'));
const outDir = path.join(repoRoot, 'content', 'generated');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) files.push(full);
  }
  return files;
}

function toTitle(name) {
  return name
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function subjectFromPath(filePath) {
  const rel = path.relative(repoRoot, filePath);
  const parts = rel.split(path.sep);
  const semester = parts[0] === 'f Sem 1' ? 'Sem 1' : 'Sem 2';
  const subjectFolder = parts[1] || '';
  const subjectConfig = model.subjects.find((s) => s.semester === semester && subjectFolder.includes(s.folderHint));
  return {
    semester,
    name: subjectConfig ? subjectConfig.name : toTitle(subjectFolder.replace(/^f\s+/i, '')),
  };
}

function extractTopicTitle(text, fallback) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const candidate = lines.find((line) => line.length > 8 && line.length < 90 && /[A-Za-z]/.test(line));
  return candidate ? candidate.replace(/\s+/g, ' ') : fallback;
}

function summarize(text) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return 'No extractable text found in this PDF.';
  const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
  return sentences.slice(0, model.extraction.maxSummarySentences).join(' ');
}

function buildCards(topic, summary) {
  const sentences = summary.split(/(?<=[.!?])\s+/).filter(Boolean);
  return sentences.slice(0, model.extraction.maxCardsPerLesson).map((sentence) => sentence.trim());
}

function buildQuiz(topic, summary) {
  const keywords = summary
    .split(/\s+/)
    .filter((word) => word.length > 6)
    .slice(0, 3);
  return keywords.map((word, index) => ({
    question: `Which concept is most closely related to ${word.replace(/[.,]/g, '')}?`,
    options: ['Definition', 'Example', 'Unrelated', 'Metadata'],
    answer: 'Definition',
    explanation: `This is a lightweight review question based on ${topic}.`,
    id: `${topic.replace(/\s+/g, '-').toLowerCase()}-${index + 1}`,
  }));
}

async function parsePdf(filePath) {
  const data = await pdfParse(fs.readFileSync(filePath));
  const text = (data.text || '').trim();
  const subject = subjectFromPath(filePath);
  const fallbackTopic = path.basename(filePath, '.pdf');
  const topic = extractTopicTitle(text, toTitle(fallbackTopic));
  const summary = summarize(text);
  return {
    file: path.relative(repoRoot, filePath),
    topic,
    summary,
    cards: buildCards(topic, summary),
    quiz: buildQuiz(topic, summary),
    glossary: Array.from(new Set((summary.match(/\b[A-Za-z][A-Za-z-]{5,}\b/g) || []).slice(0, 8))).map((term) => ({ term, definition: `Key term from ${topic}.` })),
    semester: subject.semester,
    subject: subject.name,
  };
}

async function main() {
  ensureDir(outDir);
  const files = sourceRoots.flatMap((root) => (fs.existsSync(root) ? walk(root) : []));
  const pdfs = files.filter((file) => file.toLowerCase().endsWith('.pdf'));
  const lessons = [];

  for (const file of pdfs) {
    try {
      lessons.push(await parsePdf(file));
    } catch (error) {
      lessons.push({
        file: path.relative(repoRoot, file),
        topic: path.basename(file, '.pdf'),
        summary: 'Extraction failed for this file. Use it as a placeholder until OCR or manual extraction is added.',
        cards: ['Extraction failed.'],
        quiz: [],
        glossary: [],
        semester: file.includes(`${path.sep}f Sem 1${path.sep}`) ? 'Sem 1' : 'Sem 2',
        subject: subjectFromPath(file).name,
        error: error.message,
      });
    }
  }

  const grouped = new Map();
  for (const lesson of lessons) {
    const key = `${lesson.semester}::${lesson.subject}`;
    if (!grouped.has(key)) grouped.set(key, { semester: lesson.semester, name: lesson.subject, lessons: [] });
    grouped.get(key).lessons.push(lesson);
  }

  const subjects = Array.from(grouped.values()).sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(path.join(outDir, 'subjects.json'), JSON.stringify({ generatedAt: new Date().toISOString(), subjects }, null, 2));
  console.log(`Generated ${subjects.length} subjects from ${pdfs.length} PDFs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
