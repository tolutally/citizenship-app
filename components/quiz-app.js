'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

function formatTime(sec) {
  return `00:${String(sec).padStart(2, '0')}`;
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function QuizApp({ setId }) {
  const sessionKey = 'citizenship-ongoing-test';
  const progressKey = 'citizenship-session-progress';
  const [practiceSets, setPracticeSets] = useState([]);
  const [activeSet, setActiveSet] = useState(null);
  const [completedSummary, setCompletedSummary] = useState(null);
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
  const [reviewFilter, setReviewFilter] = useState('all');
  const timerRef = useRef(null);
  const startedAtRef = useRef(Date.now());

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
      startedAtRef.current = parsed.startedAt ? new Date(parsed.startedAt).getTime() : Date.now();
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
    if (!currentQuestion || currentQuestion.id === 'complete') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setCountdown(0);
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

    startedAtRef.current = Date.now();
    setActiveSet(set);
    setCompletedSummary(null);
    setReviewFilter('all');
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
      startedAt: new Date(startedAtRef.current).toISOString(),
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
    const finishedAt = Date.now();
    const elapsedSeconds = Math.max(Math.round((finishedAt - startedAtRef.current) / 1000), 0);

    if (typeof window !== 'undefined') {
      let progress = { attempts: [] };
      const storage = window.localStorage || window.sessionStorage;
      const stored = storage.getItem(progressKey);
      if (stored) {
        try {
          progress = JSON.parse(stored);
        } catch {
          progress = { attempts: [] };
        }
      }

      const previousAttempts = Array.isArray(progress.attempts)
        ? progress.attempts.filter((attempt) => String(attempt.setId) !== String(summary.setId))
        : [];
      const latestAttempt = {
        setId: summary.setId,
        setName: summary.setName,
        correct: Number(summary.correct || 0),
        incorrect: Number(summary.incorrect || 0),
        total: Number(summary.total || 0),
        accuracy: Number(summary.accuracy || 0),
        passed: Boolean(summary.passed),
        elapsedSeconds,
        completedAt: new Date().toISOString()
      };
      const attempts = [latestAttempt, ...previousAttempts].sort(
        (left, right) => new Date(right.completedAt || 0).getTime() - new Date(left.completedAt || 0).getTime()
      );
      const updatedTotalScore = attempts.reduce(
        (totalScore, attempt) => totalScore + Number(attempt.accuracy || 0),
        0
      );
      const payload = {
        completed: attempts.length,
        totalScore: updatedTotalScore,
        avgScore: attempts.length ? Math.round(updatedTotalScore / attempts.length) : 0,
        updatedAt: latestAttempt.completedAt,
        attempts
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
    setCompletedSummary({ ...summary, elapsedSeconds });
    setActiveSet((current) => ({
      ...current,
      questions: [
        {
          id: 'complete',
          questionText: `Great work — you completed ${summary.setName}.`,
          options: [],
          topic: summary.topicNeedingPractice
        }
      ]
    }));
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

  async function handleRetry() {
    if (!activeSet?.id) {
      return;
    }

    await loadPracticeSet(activeSet.id);
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
      startedAt: new Date(startedAtRef.current).toISOString(),
      updatedAt: new Date().toISOString()
    };

    window.sessionStorage.setItem(sessionKey, JSON.stringify(payload));
    setSaveMessage('Saved');
    window.setTimeout(() => setSaveMessage(''), 1200);
  }

  const isCompleteView = currentQuestion?.id === 'complete' && completedSummary;
  const reviewCounts = useMemo(() => {
    const results = completedSummary?.results || [];
    const correct = results.filter((result) => result.isCorrect).length;
    const wrong = results.length - correct;

    return {
      all: results.length,
      correct,
      wrong
    };
  }, [completedSummary]);
  const filteredResults = useMemo(() => {
    const results = completedSummary?.results || [];

    if (reviewFilter === 'correct') {
      return results.filter((result) => result.isCorrect);
    }

    if (reviewFilter === 'wrong') {
      return results.filter((result) => !result.isCorrect);
    }

    return results;
  }, [completedSummary, reviewFilter]);

  return (
    <div className="app-shell">
      <header className="practice-frame">
        <div className="frame-row">
          <Link className="frame-link" href="/">
            Exit
          </Link>
          <div className="frame-center" aria-live="polite">
            <span className="frame-timer">{isCompleteView ? 'Done' : formatTime(countdown)}</span>
          </div>
          <div className="frame-right">
            <span className="frame-count">
              {isCompleteView
                ? 'Results'
                : `Question ${Math.min(questionIndex + 1, totalQuestions || 20)} of ${totalQuestions || 20}`}
            </span>
            {!isCompleteView ? (
              <>
                <button type="button" className="ghost-btn frame-save" onClick={handleSaveProgress}>
                  Save
                </button>
                {saveMessage ? <span className="frame-saved">{saveMessage}</span> : null}
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className={isCompleteView ? 'layout result-layout' : 'layout'}>
        {!isCompleteView ? (
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
        ) : null}
        <section className="card quiz-card" aria-live="polite">
          {isCompleteView ? (
            <div className="result-panel">
              <div className="result-hero">
                <div className="result-breadcrumbs">
                  <Link href="/">Home</Link>
                  <span>/</span>
                  <span>Practice</span>
                  <span>/</span>
                  <span>Result</span>
                </div>
                <h1 className="result-title">{completedSummary.setName}</h1>
                <p className={`result-badge ${completedSummary.passed ? 'pass' : 'fail'}`}>
                  {completedSummary.passed ? 'Pass' : 'Not Passed'}
                </p>
              </div>

              <div className="result-metrics">
                <article className="result-metric">
                  <span>Score</span>
                  <strong>{completedSummary.correct}/{completedSummary.total}</strong>
                  <small>{completedSummary.accuracy}%</small>
                </article>
                <article className="result-metric">
                  <span>Time</span>
                  <strong>{formatDuration(completedSummary.elapsedSeconds || 0)}</strong>
                  <small>completed</small>
                </article>
                <article className="result-metric">
                  <span>To Pass</span>
                  <strong>{completedSummary.passingScore}</strong>
                  <small>correct needed</small>
                </article>
              </div>

              <div className="result-progress">
                <div className="result-progress-bar" aria-hidden="true">
                  <span
                    className="result-progress-correct"
                    style={{ width: `${(completedSummary.correct / completedSummary.total) * 100}%` }}
                  />
                </div>
                <div className="result-progress-meta">
                  <span>{completedSummary.correct} correct</span>
                  <span>{completedSummary.incorrect} wrong</span>
                </div>
              </div>

              <p className="result-copy">
                {completedSummary.passed
                  ? `You cleared the ${completedSummary.passingScore}/${completedSummary.total} pass mark.`
                  : `You need ${completedSummary.passingScore} correct answers to pass this mock test.`}{' '}
                {completedSummary.recommendation}
              </p>

              <div className="result-recommendation">
                <p className="result-label">Recommendation</p>
                <p>{completedSummary.recommendation}</p>
              </div>

              {completedSummary.topicNeedingPractice !== 'None' ? (
                <p className="result-topic">Review next: {completedSummary.topicNeedingPractice}</p>
              ) : null}

              <div className="actions result-actions">
                <button type="button" className="primary-btn" onClick={handleRetry}>
                  Retry
                </button>
                <Link className="ghost-btn" href="/#session-tracker">
                  Back to home
                </Link>
              </div>

              <div className="result-filters" role="tablist" aria-label="Review filter">
                <button
                  type="button"
                  className={reviewFilter === 'all' ? 'result-filter active' : 'result-filter'}
                  onClick={() => setReviewFilter('all')}
                >
                  All ({reviewCounts.all})
                </button>
                <button
                  type="button"
                  className={reviewFilter === 'correct' ? 'result-filter active' : 'result-filter'}
                  onClick={() => setReviewFilter('correct')}
                >
                  Correct ({reviewCounts.correct})
                </button>
                <button
                  type="button"
                  className={reviewFilter === 'wrong' ? 'result-filter active' : 'result-filter'}
                  onClick={() => setReviewFilter('wrong')}
                >
                  Wrong ({reviewCounts.wrong})
                </button>
              </div>

              <div className="result-review-grid">
                {filteredResults.map((result, index) => (
                  <article key={result.questionId} className="review-card">
                    <div className="review-card-head">
                      <div>
                        <p className="review-topic">{result.topic}</p>
                        <p className="review-meta">Question {index + 1}</p>
                      </div>
                      <span className={result.isCorrect ? 'review-status pass' : 'review-status fail'}>
                        {result.isCorrect ? 'Correct' : 'Wrong'}
                      </span>
                    </div>
                    <h3 className="review-question">{result.questionText}</h3>
                    <div className="review-options">
                      {(result.options || []).map((option) => {
                        const isCorrectAnswer = option === result.correctAnswer;
                        const isSelectedWrong = option === result.userAnswer && !result.isCorrect;
                        const optionClass = isCorrectAnswer
                          ? 'review-option correct'
                          : isSelectedWrong
                            ? 'review-option wrong'
                            : 'review-option';

                        return (
                          <div key={`${result.questionId}-${option}`} className={optionClass}>
                            {option}
                          </div>
                        );
                      })}
                    </div>
                    {!result.isCorrect ? (
                      <p className="review-explanation">{result.explanation}</p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </section>
      </main>
    </div>
  );
}