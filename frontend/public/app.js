let practiceSets = [];
let activeSet = null;
let questionIndex = 0;
let countdown = 20;
let timerHandle;
const answers = {};
let isLoading = false;
let isFinishing = false;

const setLabel = document.getElementById('setLabel');
const questionText = document.getElementById('questionText');
const answerForm = document.getElementById('answerForm');
const feedback = document.getElementById('feedback');
const timer = document.getElementById('timer');
const overviewList = document.getElementById('overviewList');
const newPracticeBtn = document.getElementById('newPracticeBtn');
const themeToggle = document.getElementById('themeToggle');
const practiceCount = document.getElementById('practiceCount');

function formatTime(sec) {
  return `00:${String(sec).padStart(2, '0')}`;
}

function resetFeedback() {
  feedback.className = 'feedback hidden';
  feedback.textContent = '';
  feedback.innerHTML = '';
}

function setActionButtonsDisabled(disabled) {
  const submitBtn = answerForm.querySelector('button[type="submit"]');
  const nextBtn = document.getElementById('nextBtn');

  if (submitBtn) submitBtn.disabled = disabled;
  if (nextBtn) nextBtn.disabled = disabled || nextBtn.disabled;
}

function updateControls() {
  const locked = isLoading || isFinishing;
  setActionButtonsDisabled(locked);
  newPracticeBtn.disabled = locked || !practiceSets.length;
}

function safeText(value, fallback) {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function safeQuestion(rawQuestion, fallbackIndex) {
  const options = Array.isArray(rawQuestion?.options)
    ? rawQuestion.options.filter((option) => typeof option === 'string' && option.trim())
    : [];

  return {
    id: rawQuestion?.id ?? `question-${fallbackIndex}`,
    questionText: safeText(rawQuestion?.questionText, 'Question text unavailable.'),
    options,
    correctAnswer: safeText(rawQuestion?.correctAnswer, 'Unavailable'),
    explanation: safeText(rawQuestion?.explanation, '')
  };
}

function normalizeSet(rawSet) {
  const normalizedQuestions = Array.isArray(rawSet?.questions)
    ? rawSet.questions.map((question, idx) => safeQuestion(question, idx)).filter((question) => question.options.length)
    : [];

  return {
    id: rawSet?.id,
    name: safeText(rawSet?.name, 'Practice Set'),
    questions: normalizedQuestions
  };
}

function showLoading(message) {
  questionText.textContent = message;
  answerForm.innerHTML = '';
  resetFeedback();
}

function showRetry(message, retryLabel, retryHandler) {
  feedback.className = 'feedback error';
  feedback.innerHTML = `<strong>${message}</strong>`;

  const retryBtn = document.createElement('button');
  retryBtn.type = 'button';
  retryBtn.className = 'ghost-btn';
  retryBtn.textContent = retryLabel;
  retryBtn.addEventListener('click', retryHandler);

  const wrapper = document.createElement('div');
  wrapper.className = 'actions';
  wrapper.appendChild(retryBtn);
  feedback.appendChild(wrapper);
}

function startTimer(nextBtn) {
  countdown = 20;
  timer.textContent = formatTime(countdown);
  clearInterval(timerHandle);

  timerHandle = setInterval(() => {
    if (isLoading || isFinishing) return;

    countdown -= 1;
    timer.textContent = formatTime(Math.max(countdown, 0));
    if (countdown <= 0) {
      clearInterval(timerHandle);
      showFeedback(false, 'Time is up.');
      nextBtn.disabled = false;
    }
  }, 1000);
}

function showFeedback(isCorrect, prefix = '') {
  const question = activeSet.questions[questionIndex];
  const status = isCorrect ? 'Correct' : 'Incorrect';
  const messagePrefix = prefix ? `${prefix} ` : '';

  feedback.className = `feedback ${isCorrect ? 'success' : 'error'}`;
  feedback.innerHTML = `<strong>${status}.</strong> ${messagePrefix}Answer: ${question.correctAnswer}. ${question.explanation || ''}`;
  clearInterval(timerHandle);
}

function renderNoQuestions() {
  setLabel.textContent = activeSet?.name || 'Practice Set';
  questionText.textContent = 'This set does not currently have any available questions.';
  answerForm.innerHTML = '';
  feedback.className = 'feedback error';
  feedback.textContent = 'Try another set.';
}

function renderQuestion() {
  if (!activeSet || !activeSet.questions.length) {
    renderNoQuestions();
    updateControls();
    return;
  }

  const question = activeSet.questions[questionIndex];
  setLabel.textContent = `${activeSet.name} · Question ${questionIndex + 1}/${activeSet.questions.length}`;
  questionText.textContent = question.questionText;

  const options = question.options
    .map(
      (option) => `
      <label class="answer-option">
        <input type="radio" name="answer" value="${option}" ${answers[question.id] === option ? 'checked' : ''} />
        <span>${option}</span>
      </label>`
    )
    .join('');

  answerForm.innerHTML = `${options}
    <div class="actions">
      <button type="submit" class="primary-btn">Check answer</button>
      <button type="button" id="nextBtn" class="ghost-btn" disabled>Next question</button>
    </div>`;

  const nextBtn = document.getElementById('nextBtn');
  nextBtn.addEventListener('click', moveNext);

  resetFeedback();
  startTimer(nextBtn);
  updateControls();
}

function moveNext() {
  if (isLoading || isFinishing || !activeSet) return;

  if (questionIndex < activeSet.questions.length - 1) {
    questionIndex += 1;
    renderQuestion();
    return;
  }
  finishPractice();
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
}

async function finishPractice() {
  if (!activeSet || isFinishing) return;

  clearInterval(timerHandle);
  isFinishing = true;
  updateControls();
  feedback.className = 'feedback hidden';

  try {
    const summary = await fetchJson('/api/attempts/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setId: activeSet.id, answers })
    });

    questionText.textContent = `Great work — you completed ${safeText(summary?.setName, activeSet.name)}.`;
    answerForm.innerHTML = `<p><strong>Score:</strong> ${summary?.correct ?? 0}/${summary?.total ?? 0} (${summary?.accuracy ?? 0}%)</p>`;
    feedback.className = 'feedback success';
    feedback.textContent = `Recommendation: ${safeText(summary?.recommendation, 'Keep practicing across all topics.')}`;

    overviewList.innerHTML = `
      <li><strong>Latest score:</strong> ${summary?.correct ?? 0}/${summary?.total ?? 0}</li>
      <li><strong>Accuracy:</strong> ${summary?.accuracy ?? 0}%</li>
      <li><strong>Needs work:</strong> ${safeText(summary?.topicNeedingPractice, 'Not specified')}</li>
      <li><strong>Recommendation:</strong> ${safeText(summary?.recommendation, 'Keep practicing across all topics.')}</li>
    `;
  } catch (error) {
    showRetry('We could not submit your results.', 'Retry submit', () => finishPractice());
  } finally {
    isFinishing = false;
    updateControls();
  }
}

answerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (isLoading || isFinishing || !activeSet || !activeSet.questions.length) return;

  const selected = new FormData(answerForm).get('answer');
  if (!selected) {
    showFeedback(false, 'Please choose an answer first.');
    return;
  }

  const question = activeSet.questions[questionIndex];
  answers[question.id] = selected;

  showFeedback(selected === question.correctAnswer);
  document.getElementById('nextBtn').disabled = false;
});

async function loadPracticeSet(setId) {
  isLoading = true;
  updateControls();
  showLoading('Loading practice set...');

  try {
    const rawSet = await fetchJson(`/api/practice-sets/${setId}`);
    activeSet = normalizeSet(rawSet);

    Object.keys(answers).forEach((key) => delete answers[key]);
    questionIndex = 0;

    if (!activeSet.id) {
      throw new Error('Practice set missing identifier.');
    }

    renderQuestion();
  } catch (error) {
    questionText.textContent = 'Unable to load this practice set.';
    answerForm.innerHTML = '';
    showRetry('Please try loading this set again.', 'Retry set', () => loadPracticeSet(setId));
  } finally {
    isLoading = false;
    updateControls();
  }
}

async function bootstrap() {
  isLoading = true;
  updateControls();
  showLoading('Loading practice sets...');

  try {
    const sets = await fetchJson('/api/practice-sets');
    const normalizedSets = Array.isArray(sets)
      ? sets
          .map((set) => ({ id: set?.id, name: safeText(set?.name, 'Practice Set') }))
          .filter((set) => set.id !== undefined && set.id !== null)
      : [];

    practiceSets = normalizedSets;
    practiceCount.textContent = String(practiceSets.length);

    if (!practiceSets.length) {
      questionText.textContent = 'No practice sets are available right now.';
      answerForm.innerHTML = '';
      setLabel.textContent = 'Practice Unavailable';
      feedback.className = 'feedback error';
      feedback.textContent = 'Please try again later.';
      return;
    }

    await loadPracticeSet(practiceSets[0].id);
  } catch (error) {
    questionText.textContent = 'Failed to load practice data.';
    answerForm.innerHTML = '';
    showRetry('Could not reach the practice service.', 'Retry loading', () => bootstrap());
  } finally {
    isLoading = false;
    updateControls();
  }
}

newPracticeBtn.addEventListener('click', async () => {
  if (!practiceSets.length || isLoading || isFinishing || !activeSet) return;

  const currentIndex = practiceSets.findIndex((set) => set.id === activeSet.id);
  const nextIndex = (currentIndex + 1) % practiceSets.length;
  await loadPracticeSet(practiceSets[nextIndex].id);
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('high-contrast');
});

bootstrap();
