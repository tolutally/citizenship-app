let practiceSets = [];
let activeSet = null;
let questionIndex = 0;
let countdown = 20;
let timerHandle;
const answers = {};

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
}

function startTimer(nextBtn) {
  countdown = 20;
  timer.textContent = formatTime(countdown);
  clearInterval(timerHandle);

  timerHandle = setInterval(() => {
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

function renderQuestion() {
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
}

function moveNext() {
  if (questionIndex < activeSet.questions.length - 1) {
    questionIndex += 1;
    renderQuestion();
    return;
  }
  finishPractice();
}

async function finishPractice() {
  clearInterval(timerHandle);

  const response = await fetch('/api/attempts/grade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ setId: activeSet.id, answers })
  });

  const summary = await response.json();

  questionText.textContent = `Great work — you completed ${summary.setName}.`;
  answerForm.innerHTML = `<p><strong>Score:</strong> ${summary.correct}/${summary.total} (${summary.accuracy}%)</p>`;
  feedback.className = 'feedback success';
  feedback.textContent = `Recommendation: ${summary.recommendation}`;

  overviewList.innerHTML = `
    <li><strong>Latest score:</strong> ${summary.correct}/${summary.total}</li>
    <li><strong>Accuracy:</strong> ${summary.accuracy}%</li>
    <li><strong>Needs work:</strong> ${summary.topicNeedingPractice}</li>
    <li><strong>Recommendation:</strong> ${summary.recommendation}</li>
  `;
}

answerForm.addEventListener('submit', (event) => {
  event.preventDefault();
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
  const response = await fetch(`/api/practice-sets/${setId}`);
  activeSet = await response.json();

  Object.keys(answers).forEach((key) => delete answers[key]);
  questionIndex = 0;
  renderQuestion();
}

async function bootstrap() {
  const response = await fetch('/api/practice-sets');
  practiceSets = await response.json();
  practiceCount.textContent = String(practiceSets.length);
  await loadPracticeSet(practiceSets[0].id);
}

newPracticeBtn.addEventListener('click', async () => {
  if (!practiceSets.length) return;

  const currentIndex = practiceSets.findIndex((set) => set.id === activeSet.id);
  const nextIndex = (currentIndex + 1) % practiceSets.length;
  await loadPracticeSet(practiceSets[nextIndex].id);
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('high-contrast');
});

bootstrap().catch(() => {
  questionText.textContent = 'Failed to load practice data.';
  answerForm.innerHTML = '';
});
