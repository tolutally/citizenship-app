function normalizeText(value = '') {
  return String(value)
    .replace(/\r\n?/g, '\n')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\t/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .trim();
}

function normalizeLine(line = '') {
  return normalizeText(line)
    .replace(/^[-*•\u2022]+\s*/, '')
    .replace(/^\d+[\.)]\s*/, '')
    .trim();
}

function normalizeQuestionKey(question = '') {
  return normalizeLine(question)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?!.,;:]+$/g, '')
    .trim();
}

function isQuestionLike(line = '') {
  const normalized = normalizeLine(line);
  if (!normalized) {
    return false;
  }

  if (normalized.endsWith('?')) {
    return true;
  }

  return /^(who|what|when|where|why|how|which|is|are|do|does|did|can|could|should|would|name|identify|explain|describe)\b/i.test(
    normalized
  );
}

function dedupeQuestions(items = []) {
  const seen = new Set();
  const deduped = [];

  for (const item of items) {
    const key = normalizeQuestionKey(item.question);
    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push({
      ...item,
      question: normalizeLine(item.question),
      candidateAnswers: [...new Set((item.candidateAnswers || []).map(normalizeLine).filter(Boolean))]
    });
  }

  return deduped;
}

function extractQuestionsAndAnswers(rawTranscript = '') {
  const transcript = normalizeText(rawTranscript);
  const lines = transcript
    .split('\n')
    .map((line) => normalizeLine(line))
    .filter(Boolean);

  const extracted = [];
  let current = null;

  for (const line of lines) {
    if (isQuestionLike(line)) {
      if (current) {
        extracted.push(current);
      }

      current = {
        question: line,
        candidateAnswers: []
      };
      continue;
    }

    if (current) {
      if (line.length <= 180) {
        current.candidateAnswers.push(line);
      }
      continue;
    }
  }

  if (current) {
    extracted.push(current);
  }

  return dedupeQuestions(extracted);
}

function shuffleQuestions(questions = []) {
  const shuffled = [...questions];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function chunkQuestions(questions = [], chunkSize = 20) {
  const chunks = [];

  for (let index = 0; index < questions.length; index += chunkSize) {
    chunks.push(questions.slice(index, index + chunkSize));
  }

  return chunks;
}

function generatePracticeSets(questions = [], chunkSize = 20) {
  const dedupedQuestions = dedupeQuestions(questions);
  const shuffled = shuffleQuestions(dedupedQuestions);
  const chunks = chunkQuestions(shuffled, chunkSize);

  return chunks.map((chunk, index) => ({
    id: `generated-${index + 1}`,
    name: `Generated Practice Set ${index + 1}`,
    questions: chunk
  }));
}

module.exports = {
  chunkQuestions,
  dedupeQuestions,
  extractQuestionsAndAnswers,
  generatePracticeSets,
  isQuestionLike,
  normalizeLine,
  normalizeQuestionKey,
  normalizeText
};
