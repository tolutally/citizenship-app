'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

function formatTime(sec) {
  return `00:${String(sec).padStart(2, '0')}`;
}

export default function QuizApp({ setId }) {
  const sessionKey = 'citizenship-ongoing-test';
  const progressKey = 'citizenship-session-progress';
  const [practiceSets, setPracticeSets] = useState([]);
  const [activeSet, setActiveSet] = useState(null);
  const [distributionBySet, setDistributionBySet] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({ visible: false, kind: 'success', html: '' });
  const [countdown, setCountdown] = useState(20);
  const [overviewItems, setOverviewItems] = useState([
    { label: 'Strong topic', value: 'Loading...' },
    { label: 'Needs work', value: 'Loading...' },
    { label: 'Recommendation', value: 'Loading...' }
  ]);
  const [stats, setStats] = useState({ avgScore: '82%', practiceCount: '0', streak: '5 days' });
  const [isChecking, setIsChecking] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const timerRef = useRef(null);

  const currentQuestion = activeSet?.questions?.[questionIndex] ?? null;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.sessionStorage.getItem(sessionKey);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setResumeData(parsed);
    } catch {
      window.sessionStorage.removeItem(sessionKey);
    }
  }, []);

  useEffect(() => {
    async function bootstrap() {
      try {
        const response = await fetch('/api/practice-sets');
        const sets = await response.json();

        const distributionResponse = await fetch('/api/practice-sets/distribution');
        const distributionPayload = await distributionResponse.json();
        const distributionMap = (distributionPayload.sets || []).reduce((accumulator, set) => {
          accumulator[set.id] = set.byChapter || [];
          return accumulator;
        }, {});
        setDistributionBySet(distributionMap);

        setPracticeSets(sets);
        setStats((current) => ({ ...current, practiceCount: String(sets.length) }));

        if (sets.length > 0) {
          const preferredSet = setId && sets.some((set) => set.id === setId) ? setId : sets[0].id;
          await loadPracticeSet(preferredSet, sets);
        }
      } catch {
        setFeedback({ visible: true, kind: 'error', html: '<strong>Error.</strong> Failed to load practice data.' });
      }
    }

    bootstrap();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [setId]);

  useEffect(() => {
    if (!resumeData || !activeSet) {
      setShowResumePrompt(false);
      return;
    }

    const isSameSet = String(resumeData.setId) === String(activeSet.id);
    const hasProgress = (resumeData.answeredCount || 0) > 0 || (resumeData.questionIndex || 0) > 0;
    setShowResumePrompt(isSameSet && hasProgress);
  }, [resumeData, activeSet]);

  const activeDistribution = activeSet ? distributionBySet[activeSet.id] || [] : [];
  const totalQuestions = activeSet?.questions?.length || 0;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = totalQuestions ? Math.min((answeredCount / totalQuestions) * 100, 100) : 0;

  useEffect(() => {
    if (!currentQuestion) {
      return undefined;
    }

    setCountdown(20);
    setFeedback({ visible: false, kind: 'success', html: '' });

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          clearInterval(timerRef.current);
          setFeedback({
            visible: true,
            kind: 'error',
            html: '<strong>Incorrect.</strong> Time is up.'
          });
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion?.id]);

  async function loadPracticeSet(setId, knownSets = practiceSets) {
    const response = await fetch(`/api/practice-sets/${setId}`);
    const set = await response.json();

    setActiveSet(set);
    setQuestionIndex(0);
    setAnswers({});
    setFeedback({ visible: false, kind: 'success', html: '' });
    setIsChecking(false);
    setOverviewItems([
      { label: 'Strong topic', value: set.name },
      { label: 'Needs work', value: 'Complete the set to see weak areas.' },
      { label: 'Recommendation', value: 'Answer carefully before moving on.' }
    ]);
    setStats((current) => ({ ...current, practiceCount: String(knownSets.length) }));
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !activeSet || !activeSet.questions?.length) {
      return;
    }

    if (activeSet.questions[0]?.id === 'complete') {
      window.sessionStorage.removeItem(sessionKey);
      return;
    }

    const hasProgress = answeredCount > 0 || questionIndex > 0;
    if (!hasProgress) {
      window.sessionStorage.removeItem(sessionKey);
      return;
    }

    const payload = {
      setId: activeSet.id,
      setName: activeSet.name,
      questionIndex,
      answers,
      answeredCount,
      totalQuestions: activeSet.questions.length,
      updatedAt: new Date().toISOString()
    };

    window.sessionStorage.setItem(sessionKey, JSON.stringify(payload));
    setResumeData(payload);
  }, [activeSet, questionIndex, answers, answeredCount]);

  async function finishPractice() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(sessionKey);
    }
    setResumeData(null);
    setShowResumePrompt(false);

    const response = await fetch('/api/attempts/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setId: activeSet.id, answers })
    });
    const summary = await response.json();

    if (typeof window !== 'undefined') {
      let progress = { completed: 0, totalScore: 0 };
      const storage = window.localStorage || window.sessionStorage;
      const stored = storage.getItem(progressKey);
      if (stored) {
        try {
          progress = JSON.parse(stored);
        } catch {
          progress = { completed: 0, totalScore: 0 };
        }
      }

      const updatedCompleted = Number(progress.completed || 0) + 1;
      const updatedTotalScore = Number(progress.totalScore || 0) + Number(summary.accuracy || 0);
      const payload = {
        completed: updatedCompleted,
        totalScore: updatedTotalScore,
        avgScore: Math.round(updatedTotalScore / updatedCompleted),
        updatedAt: new Date().toISOString()
      };
      storage.setItem(progressKey, JSON.stringify(payload));
      window.sessionStorage.setItem(progressKey, JSON.stringify(payload));
    }

    setFeedback({
      visible: true,
      kind: 'success',
      html: `Recommendation: ${summary.recommendation}`
    });
    setOverviewItems([
      { label: 'Latest score', value: `${summary.correct}/${summary.total}` },
      { label: 'Accuracy', value: `${summary.accuracy}%` },
      { label: 'Needs work', value: summary.topicNeedingPractice },
      { label: 'Recommendation', value: summary.recommendation }
    ]);
    setStats((current) => ({ ...current, avgScore: `${summary.accuracy}%` }));
    setActiveSet({
      ...activeSet,
      questions: [
        {
          id: 'complete',
          questionText: `Great work — you completed ${summary.setName}.`,
          options: [],
          topic: summary.topicNeedingPractice
        }
      ]
    });
    setQuestionIndex(0);
  }

  function showCheckedFeedback(selected) {
    const isCorrect = selected === currentQuestion.correctAnswer;
    const status = isCorrect ? 'Correct' : 'Incorrect';

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setFeedback({
      visible: true,
      kind: isCorrect ? 'success' : 'error',
      html: `<strong>${status}.</strong> Answer: ${currentQuestion.correctAnswer}. ${currentQuestion.explanation || ''}`
    });
  }

  function handleSelectAnswer(selected) {
    if (!currentQuestion || isChecking) {
      return;
    }

    setAnswers((current) => ({ ...current, [currentQuestion.id]: selected }));
    setIsChecking(true);
    showCheckedFeedback(selected);
  }

  async function handleNextPractice() {
    if (!practiceSets.length || !activeSet) {
      return;
    }

    const currentIndex = practiceSets.findIndex((set) => set.id === activeSet.id);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % practiceSets.length : 0;
    await loadPracticeSet(practiceSets[nextIndex].id);
    setIsChecking(false);
  }

  function handleNextQuestion() {
    if (!activeSet) {
      return;
    }

    if (questionIndex < activeSet.questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      setIsChecking(false);
      return;
    }

    finishPractice();
    setIsChecking(false);
  }

  function handleResumeContinue() {
    if (!resumeData || !activeSet) {
      return;
    }

    const safeIndex = Math.min(resumeData.questionIndex || 0, Math.max(activeSet.questions.length - 1, 0));
    setQuestionIndex(safeIndex);
    setAnswers(resumeData.answers || {});
    setFeedback({ visible: false, kind: 'success', html: '' });
    setIsChecking(false);
    setShowResumePrompt(false);
  }

  function handleResumeRestart() {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(sessionKey);
    }
    setResumeData(null);
    setShowResumePrompt(false);
    setQuestionIndex(0);
    setAnswers({});
    setFeedback({ visible: false, kind: 'success', html: '' });
    setIsChecking(false);
  }

  function handleSaveProgress() {
    if (!activeSet || typeof window === 'undefined') {
      return;
    }

    const payload = {
      setId: activeSet.id,
      setName: activeSet.name,
      questionIndex,
      answers,
      answeredCount,
      totalQuestions: activeSet.questions.length,
      updatedAt: new Date().toISOString()
    };

    window.sessionStorage.setItem(sessionKey, JSON.stringify(payload));
    setSaveMessage('Saved');
    window.setTimeout(() => setSaveMessage(''), 1200);
  }

  return (
    <div className="app-shell">
      <header className="practice-frame">
        <div className="frame-row">
          <Link className="frame-link" href="/">
            Exit
          </Link>
          <div className="frame-center" aria-live="polite">
            <span className="frame-timer">{formatTime(countdown)}</span>
          </div>
          <div className="frame-right">
            <span className="frame-count">
              Question {Math.min(questionIndex + 1, totalQuestions || 20)} of {totalQuestions || 20}
            </span>
            <button type="button" className="ghost-btn frame-save" onClick={handleSaveProgress}>
              Save
            </button>
            {saveMessage ? <span className="frame-saved">{saveMessage}</span> : null}
          </div>
        </div>
      </header>

      <main className="layout">
        <aside className="card distribution-card" aria-live="polite">
          <p className="distribution-title">Question mix</p>
          {activeDistribution.length ? (
            <ul className="distribution-list">
              {activeDistribution.map((item) => (
                <li key={item.chapter} className="distribution-item">
                  <span>{item.chapter.split(' ')[0]}</span>
                  <strong>{item.count}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="distribution-loading">Loading mix...</p>
          )}
        </aside>
        <section className="card quiz-card" aria-live="polite">
          <div className="quiz-head">
            <div className="chip-stack">
              <p className="chip">
              {activeSet
                ? `${activeSet.name} · Question ${Math.min(questionIndex + 1, activeSet.questions.length)}/${activeSet.questions.length}`
                : 'Loading practice set...'}
              </p>
            </div>
          </div>

          <div className="progress-track" aria-live="polite">
            <div className="progress-meta">
              <span>Progress</span>
              <strong>{answeredCount}/{totalQuestions || 20} answered</strong>
            </div>
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax={totalQuestions || 20}
              aria-valuenow={answeredCount}
            >
              <span style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {showResumePrompt ? (
            <div className="resume-banner" role="status" aria-live="polite">
              <div>
                <p className="resume-title">You have an unfinished test in this session.</p>
                <p className="resume-meta">
                  {resumeData?.setName || activeSet?.name || 'Practice test'} · {resumeData?.answeredCount || 0}/
                  {resumeData?.totalQuestions || totalQuestions || 20} answered
                </p>
              </div>
              <div className="resume-actions">
                <button type="button" className="primary-btn" onClick={handleResumeContinue}>
                  Continue
                </button>
                <button type="button" className="ghost-btn" onClick={handleResumeRestart}>
                  Restart
                </button>
              </div>
            </div>
          ) : null}

          <h2>{currentQuestion?.questionText || 'Loading practice data...'}</h2>

          <form className="answers" autoComplete="off" onSubmit={(event) => event.preventDefault()}>
            {(currentQuestion?.options || []).map((option) => (
              <label className="answer-option" key={option}>
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  disabled={feedback.visible}
                  onChange={() => handleSelectAnswer(option)}
                />
                <span>{option}</span>
              </label>
            ))}

            {currentQuestion?.options?.length ? (
              <div className="actions">
                <button type="button" className="ghost-btn" disabled={!feedback.visible} onClick={handleNextQuestion}>
                  Next question
                </button>
              </div>
            ) : null}
          </form>

          <div
            className={`feedback ${feedback.visible ? feedback.kind : 'hidden'}`}
            role="status"
            dangerouslySetInnerHTML={{ __html: feedback.visible ? feedback.html : '' }}
          />
        </section>
      </main>
    </div>
  );
}