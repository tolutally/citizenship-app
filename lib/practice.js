import { createClient } from '../utils/supabase/server';

const TOTAL_SETS = 42;
const MOCK_SETS = 12;
const PRACTICE_SETS = 30;
const QUESTIONS_PER_SET = 20;
const RNG_SEED = 91357;

function normalizeQuestion(row, chapterTitle) {
  const sortedOptions = [...(row.options || [])].sort((left, right) => left.label.localeCompare(right.label));
  const correctOption = sortedOptions.find((option) => option.label === row.correct_answer);

  return {
    id: `q${row.id}`,
    questionText: row.question_text,
    options: sortedOptions.map((option) => option.option_text),
    correctAnswer: correctOption ? correctOption.option_text : row.explanation,
    explanation: row.explanation,
    topic: chapterTitle
  };
}

function mulberry32(seed) {
  return function rng() {
    let value = seed;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithRng(items, rng) {
  const list = [...items];
  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
  }
  return list;
}

function buildPracticeSetDefinitions() {
  const sets = [];
  for (let index = 1; index <= MOCK_SETS; index += 1) {
    sets.push({
      id: `mock-${index}`,
      name: `Mock Test ${index}`,
      label: 'Mock Test',
      questionCount: QUESTIONS_PER_SET
    });
  }
  for (let index = 1; index <= PRACTICE_SETS; index += 1) {
    sets.push({
      id: `practice-${index}`,
      name: `Practice Set ${index}`,
      label: 'Practice Set',
      questionCount: QUESTIONS_PER_SET
    });
  }
  return sets.slice(0, TOTAL_SETS);
}

function allocateChapterSlots(chapters, countsByChapter) {
  const baseSlots = chapters.map((chapter) => ({
    chapterId: chapter.id,
    slots: 1,
    weight: countsByChapter[chapter.id] || 0,
    eligible: (countsByChapter[chapter.id] || 0) >= QUESTIONS_PER_SET
  }));

  const remaining = QUESTIONS_PER_SET - baseSlots.length;
  if (remaining <= 0) {
    return baseSlots;
  }

  const eligible = baseSlots.filter((item) => item.eligible);
  const totalWeight = eligible.reduce((total, item) => total + item.weight, 0) || 1;
  const extras = eligible.map((item) => {
    const exact = (item.weight / totalWeight) * remaining;
    return {
      chapterId: item.chapterId,
      base: item.slots,
      extra: Math.floor(exact),
      remainder: exact - Math.floor(exact)
    };
  });

  let allocated = extras.reduce((total, item) => total + item.extra, 0);
  let remainingExtras = remaining - allocated;

  extras
    .sort((left, right) => {
      if (right.remainder !== left.remainder) {
        return right.remainder - left.remainder;
      }
      return left.chapterId - right.chapterId;
    })
    .forEach((item) => {
      if (remainingExtras > 0) {
        item.extra += 1;
        remainingExtras -= 1;
      }
    });

  const extrasMap = extras.reduce((accumulator, item) => {
    accumulator[item.chapterId] = item.base + item.extra;
    return accumulator;
  }, {});

  return baseSlots.map((item) => ({
    chapterId: item.chapterId,
    slots: item.eligible ? extrasMap[item.chapterId] : item.slots
  }));
}

function buildMockPracticeSets(chapters, questionsByChapter) {
  const countsByChapter = chapters.reduce((accumulator, chapter) => {
    accumulator[chapter.id] = questionsByChapter[chapter.id]?.length || 0;
    return accumulator;
  }, {});

  const slotPlan = allocateChapterSlots(chapters, countsByChapter);
  const pointers = chapters.reduce((accumulator, chapter) => {
    accumulator[chapter.id] = 0;
    return accumulator;
  }, {});

  const shuffledByChapter = chapters.reduce((accumulator, chapter) => {
    const rng = mulberry32(RNG_SEED + chapter.id * 97);
    accumulator[chapter.id] = shuffleWithRng(questionsByChapter[chapter.id] || [], rng);
    return accumulator;
  }, {});

  return buildPracticeSetDefinitions().map((definition, index) => {
    const setQuestions = [];
    slotPlan.forEach((slot) => {
      const chapterQuestions = shuffledByChapter[slot.chapterId];
      const chapterCount = chapterQuestions.length || 1;
      for (let pick = 0; pick < slot.slots; pick += 1) {
        const pointer = pointers[slot.chapterId] % chapterCount;
        setQuestions.push(chapterQuestions[pointer]);
        pointers[slot.chapterId] += 1;
      }
    });

    const mixRng = mulberry32(RNG_SEED + (index + 1) * 131);
    const mixedQuestions = shuffleWithRng(setQuestions, mixRng).slice(0, QUESTIONS_PER_SET);

    return {
      id: definition.id,
      name: definition.name,
      questions: mixedQuestions
    };
  });
}

async function loadQuestionsByChapter() {
  const supabase = await createClient();
  const { data: chapters, error: chapterError } = await supabase
    .from('chapters')
    .select('id, number, title')
    .order('number', { ascending: true });

  if (chapterError) {
    throw chapterError;
  }

  const { data: questions, error: questionError } = await supabase
    .from('questions')
    .select('id, chapter_id, question_number, question_text, correct_answer, explanation, options(label, option_text), chapters(id, number, title)')
    .order('question_number', { ascending: true });

  if (questionError) {
    throw questionError;
  }

  const chaptersById = chapters.reduce((accumulator, chapter) => {
    accumulator[chapter.id] = chapter.title;
    return accumulator;
  }, {});

  const questionsByChapter = questions.reduce((accumulator, row) => {
    const chapterId = row.chapter_id;
    const chapterTitle = chaptersById[chapterId] || row.chapters?.title || 'General Knowledge';
    if (!accumulator[chapterId]) {
      accumulator[chapterId] = [];
    }
    accumulator[chapterId].push(normalizeQuestion(row, chapterTitle));
    return accumulator;
  }, {});

  return { chapters, questionsByChapter };
}

async function fetchPracticeSets() {
  return buildPracticeSetDefinitions();
}

async function fetchPracticeSetById(setId) {
  const definitions = buildPracticeSetDefinitions();
  const target = definitions.find((set) => set.id === String(setId));
  if (!target) {
    return null;
  }

  const { chapters, questionsByChapter } = await loadQuestionsByChapter();
  const mockSets = buildMockPracticeSets(chapters, questionsByChapter);
  const selected = mockSets.find((set) => set.id === target.id);

  return selected ? { ...selected, name: target.name } : null;
}

async function fetchPracticeSetDistributions() {
  const { chapters, questionsByChapter } = await loadQuestionsByChapter();
  const mockSets = buildMockPracticeSets(chapters, questionsByChapter);

  return mockSets.map((set) => {
    const counts = set.questions.reduce((accumulator, question) => {
      accumulator[question.topic] = (accumulator[question.topic] || 0) + 1;
      return accumulator;
    }, {});

    const byChapter = chapters.map((chapter) => ({
      chapter: chapter.title,
      count: counts[chapter.title] || 0
    }));

    return {
      id: set.id,
      name: set.name,
      total: set.questions.length,
      byChapter
    };
  });
}

function buildSummary(set, answers) {
  const total = set.questions.length;
  const passingScore = 15;
  let correct = 0;
  const weakTopics = {};

  const results = set.questions.map((question) => {
    const userAnswer = answers[question.id] ?? '';
    const isCorrect = userAnswer === question.correctAnswer;

    if (isCorrect) {
      correct += 1;
    } else {
      weakTopics[question.topic] = (weakTopics[question.topic] || 0) + 1;
    }

    return {
      questionId: question.id,
      questionText: question.questionText,
      topic: question.topic,
      options: question.options,
      userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      explanation: question.explanation
    };
  });

  const accuracy = total ? Math.round((correct / total) * 100) : 0;
  const incorrect = Math.max(total - correct, 0);
  const passed = correct >= passingScore;
  const topicNeedingPractice = Object.entries(weakTopics).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  let recommendation = 'Great consistency. Move to a mixed difficulty set.';
  if (accuracy < 60) {
    recommendation = 'Review core concepts and retry this set in untimed mode first.';
  } else if (accuracy < 80) {
    recommendation = `Focus on ${topicNeedingPractice} and retake tomorrow.`;
  }

  return {
    setId: set.id,
    setName: set.name,
    total,
    correct,
    incorrect,
    accuracy,
    passed,
    passingScore,
    topicNeedingPractice,
    recommendation,
    results
  };
}

async function testSupabaseConnection() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('chapters').select('id, title').limit(1);

  if (error) {
    throw error;
  }

  return {
    ok: true,
    urlConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    keyConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    sampleChapter: data[0] || null
  };
}

export {
  buildSummary,
  fetchPracticeSetById,
  fetchPracticeSetDistributions,
  fetchPracticeSets,
  testSupabaseConnection
};