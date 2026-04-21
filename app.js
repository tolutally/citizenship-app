const practiceSets = [
  {
    name: "Practice 1",
    questions: [
      {
        question: "What are the three main levels of government in Canada?",
        options: [
          "Federal, provincial, municipal",
          "National, local, indigenous",
          "Royal, provincial, city",
          "Federal, territorial, borough",
        ],
        answer: "Federal, provincial, municipal",
        explanation:
          "Canada's three levels are federal, provincial or territorial, and municipal.",
      },
      {
        question: "Who is Canada's Head of State?",
        options: ["The Prime Minister", "The Governor General", "The King", "The Premier"],
        answer: "The King",
        explanation: "Canada is a constitutional monarchy. The monarch is Head of State.",
      },
      {
        question: "What is the highest court in Canada?",
        options: ["Federal Court", "Supreme Court of Canada", "Court of Appeal", "Parliament Court"],
        answer: "Supreme Court of Canada",
        explanation: "The Supreme Court of Canada is the final court of appeal.",
      },
    ],
  },
];

let setIndex = 0;
let questionIndex = 0;
let correctAnswers = 0;
let countdown = 20;
let timerHandle;

const setLabel = document.getElementById("setLabel");
const questionText = document.getElementById("questionText");
const answerForm = document.getElementById("answerForm");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const timer = document.getElementById("timer");
const overviewList = document.getElementById("overviewList");
const newPracticeBtn = document.getElementById("newPracticeBtn");
const themeToggle = document.getElementById("themeToggle");

function formatTime(sec) {
  return `00:${String(sec).padStart(2, "0")}`;
}

function renderQuestion() {
  const set = practiceSets[setIndex];
  const question = set.questions[questionIndex];

  setLabel.textContent = `${set.name} · Question ${questionIndex + 1}/20`;
  questionText.textContent = question.question;

  const optionsMarkup = question.options
    .map(
      (option) => `
        <label class="answer-option">
          <input type="radio" name="answer" value="${option}" />
          <span>${option}</span>
        </label>
      `,
    )
    .join("");

  answerForm.innerHTML = `${optionsMarkup}
    <div class="actions">
      <button type="submit" class="primary-btn">Check answer</button>
      <button type="button" id="nextBtn" class="ghost-btn" disabled>Next question</button>
    </div>`;

  feedback.className = "feedback hidden";
  feedback.textContent = "";

  const refreshedNextBtn = document.getElementById("nextBtn");
  refreshedNextBtn.addEventListener("click", moveNext);

  countdown = 20;
  timer.textContent = formatTime(countdown);
  clearInterval(timerHandle);
  timerHandle = setInterval(() => {
    countdown -= 1;
    timer.textContent = formatTime(Math.max(countdown, 0));
    if (countdown <= 0) {
      clearInterval(timerHandle);
      showFeedback(false, "Time is up!");
      refreshedNextBtn.disabled = false;
    }
  }, 1000);
}

function showFeedback(isCorrect, prefix = "") {
  const set = practiceSets[setIndex];
  const question = set.questions[questionIndex];
  const status = isCorrect ? "Correct" : "Incorrect";
  const messagePrefix = prefix ? `${prefix} ` : "";

  feedback.className = `feedback ${isCorrect ? "success" : "error"}`;
  feedback.innerHTML = `<strong>${status}.</strong> ${messagePrefix}Answer: ${question.answer}. ${question.explanation}`;
  clearInterval(timerHandle);
}

function moveNext() {
  const set = practiceSets[setIndex];
  if (questionIndex < set.questions.length - 1) {
    questionIndex += 1;
    renderQuestion();
    return;
  }
  finishPractice();
}

function finishPractice() {
  clearInterval(timerHandle);
  const total = practiceSets[setIndex].questions.length;
  const accuracy = Math.round((correctAnswers / total) * 100);

  questionText.textContent = `Great work — you completed ${practiceSets[setIndex].name}.`;
  answerForm.innerHTML = `<p><strong>Score:</strong> ${correctAnswers}/${total} (${accuracy}%)</p>`;
  feedback.className = "feedback success";
  feedback.textContent = "Recommendation: Repeat weak topics, then start the next timed practice set.";

  overviewList.innerHTML = `
    <li><strong>Latest score:</strong> ${correctAnswers}/${total}</li>
    <li><strong>Accuracy:</strong> ${accuracy}%</li>
    <li><strong>Recommendation:</strong> Focus next on Canadian history and symbols.</li>
  `;
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selected = new FormData(answerForm).get("answer");
  if (!selected) {
    showFeedback(false, "Please choose an answer first.");
    return;
  }

  const question = practiceSets[setIndex].questions[questionIndex];
  const isCorrect = selected === question.answer;
  if (isCorrect) correctAnswers += 1;

  showFeedback(isCorrect);
  document.getElementById("nextBtn").disabled = false;
});

newPracticeBtn.addEventListener("click", () => {
  questionIndex = 0;
  correctAnswers = 0;
  renderQuestion();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("high-contrast");
});

renderQuestion();
