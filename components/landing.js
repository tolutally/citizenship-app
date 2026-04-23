'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

function normalizeSessionProgress(parsed) {
  const attempts = Array.isArray(parsed?.attempts)
    ? parsed.attempts.map((attempt) => ({
        setId: attempt.setId,
        setName: attempt.setName,
        correct: Number(attempt.correct || 0),
        incorrect: Number(attempt.incorrect || 0),
        total: Number(attempt.total || 0),
        accuracy: Number(attempt.accuracy || 0),
        passed: Boolean(attempt.passed),
        completedAt: attempt.completedAt || ''
      }))
    : [];

  if (attempts.length) {
    const totalScore = attempts.reduce((sum, attempt) => sum + Number(attempt.accuracy || 0), 0);
    return {
      completed: attempts.length,
      avgScore: Math.round(totalScore / attempts.length),
      attempts,
      updatedAt: parsed?.updatedAt || attempts[0]?.completedAt || ''
    };
  }

  return {
    completed: Number(parsed?.completed || 0),
    avgScore: Number(parsed?.avgScore || 0),
    attempts: [],
    updatedAt: parsed?.updatedAt || ''
  };
}

export default function Landing() {
  const [practiceSets, setPracticeSets] = useState([]);
  const [status, setStatus] = useState('loading');
  const [resumeSession, setResumeSession] = useState(null);
  const [sessionProgress, setSessionProgress] = useState({ completed: 0, avgScore: 0, attempts: [] });
  const [progressUpdatedAt, setProgressUpdatedAt] = useState('');

  useEffect(() => {
    async function loadSets() {
      try {
        const response = await fetch('/api/practice-sets');
        const sets = await response.json();
        setPracticeSets(sets);
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    }

    loadSets();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.sessionStorage.getItem('citizenship-ongoing-test');
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setResumeSession(parsed);
    } catch {
      window.sessionStorage.removeItem('citizenship-ongoing-test');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const progressKey = 'citizenship-session-progress';
    const storage = window.localStorage || window.sessionStorage;
    const stored = storage.getItem(progressKey) || window.sessionStorage.getItem(progressKey);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      const normalized = normalizeSessionProgress(parsed);
      setSessionProgress(normalized);
      setProgressUpdatedAt(normalized.updatedAt || '');
    } catch {
      window.sessionStorage.removeItem(progressKey);
      window.localStorage.removeItem(progressKey);
    }
  }, []);

  function handleResetSessionProgress() {
    if (typeof window === 'undefined') {
      return;
    }

    const progressKey = 'citizenship-session-progress';
    window.sessionStorage.removeItem(progressKey);
    window.localStorage.removeItem(progressKey);
    setSessionProgress({ completed: 0, avgScore: 0, attempts: [] });
    setProgressUpdatedAt('');
  }

  const formattedProgressUpdatedAt = progressUpdatedAt
    ? new Date(progressUpdatedAt).toLocaleString()
    : 'Not started yet';

  const totalQuestions = useMemo(() => {
    return practiceSets.reduce((total, set) => total + (set.questionCount || 0), 0);
  }, [practiceSets]);

  const attemptsBySet = useMemo(() => {
    return sessionProgress.attempts.reduce((lookup, attempt) => {
      lookup[String(attempt.setId)] = attempt;
      return lookup;
    }, {});
  }, [sessionProgress.attempts]);

  const featuredSet = practiceSets[0];

  return (
    <div className="landing">
      {resumeSession ? (
        <div className="resume-banner" role="status" aria-live="polite">
          <div>
            <p className="resume-title">Continue your test from this session</p>
            <p className="resume-meta">
              {resumeSession.setName || 'Practice test'} · {resumeSession.answeredCount || 0}/
              {resumeSession.totalQuestions || 20} answered
            </p>
          </div>
          <div className="resume-actions">
            <Link className="primary-btn" href={`/practice/${resumeSession.setId}`}>
              Continue test
            </Link>
            <button
              className="ghost-btn"
              type="button"
              onClick={() => {
                window.sessionStorage.removeItem('citizenship-ongoing-test');
                setResumeSession(null);
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
      <header className="landing-hero">
        <div className="brand-row">
          <span className="brand-badge">CanadaCitizenTest.ca</span>
        </div>
        <h1>Own the citizenship test with realistic mock exams.</h1>
        <p className="hero-lead">
          Each test pulls 20 questions across every chapter, weighted toward the bigger sections.
          You will get instant feedback and clear recommendations on what to review next.
        </p>
        <div className="hero-actions">
          {featuredSet ? (
            <Link className="primary-btn" href={`/practice/${featuredSet.id}`}>
              Start Mock Test 1
            </Link>
          ) : (
            <button className="primary-btn" type="button" disabled>
              Loading tests
            </button>
          )}
          <a className="ghost-btn" href="#practice-sets">
            Browse all tests
          </a>
        </div>
        <div className="hero-metrics">
          <article>
            <p className="metric-label">Practice sets</p>
            <p className="metric-value">{practiceSets.length || '42'}</p>
          </article>
          <article>
            <p className="metric-label">Questions inside</p>
            <p className="metric-value">{totalQuestions || '840'}</p>
          </article>
          <article>
            <p className="metric-label">Next milestone</p>
            <p className="metric-value">5-day streak</p>
          </article>
        </div>
      </header>

      <section className="session-tracker" id="session-tracker" aria-label="Session progress">
        <div>
          <p className="tracker-title">Session tracker</p>
          <p className="tracker-meta">
            Completed: {sessionProgress.completed} tests this session · Avg Score: {sessionProgress.avgScore}%
          </p>
          <p className="tracker-meta">Last updated: {formattedProgressUpdatedAt}</p>
        </div>
        <div className="tracker-dots" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, index) => (
            <span
              key={`dot-${index}`}
              className={index < Math.min(sessionProgress.completed, 20) ? 'dot active' : 'dot'}
            />
          ))}
        </div>
        {sessionProgress.attempts.length ? (
          <div className="tracker-attempts">
            {sessionProgress.attempts.map((attempt) => (
              <span
                key={attempt.setId}
                className={`tracker-attempt ${attempt.passed ? 'pass' : 'fail'}`}
              >
                {attempt.setName} · {attempt.correct}/{attempt.total} · {attempt.passed ? 'Passed' : 'Not passed'}
              </span>
            ))}
          </div>
        ) : null}
        <button type="button" className="ghost-btn" onClick={handleResetSessionProgress}>
          Reset session
        </button>
      </section>

      <section className="sets-section" id="practice-sets">
        <div className="sets-header">
          <h2>Choose a mock exam or practice set</h2>
          <p>Every test includes at least one question from each chapter.</p>
        </div>

        {status === 'error' ? (
          <div className="sets-error">Unable to load practice sets right now. Refresh to try again.</div>
        ) : (
          <div className="sets-grid">
            {practiceSets.map((set) => {
              const sessionAttempt = attemptsBySet[String(set.id)];

              return (
                <Link className="set-card" key={set.id} href={`/practice/${set.id}`}>
                  <div>
                    <p className="set-eyebrow">{set.label}</p>
                    <h3>{set.name}</h3>
                    <p className="set-meta">{set.questionCount} questions</p>
                    {sessionAttempt ? (
                      <div className="set-session-state">
                        <span className={`set-session-tag ${sessionAttempt.passed ? 'pass' : 'fail'}`}>
                          {sessionAttempt.passed ? 'Passed' : 'Not passed'}
                        </span>
                        <span className="set-session-score">{sessionAttempt.correct}/{sessionAttempt.total}</span>
                      </div>
                    ) : null}
                  </div>
                  <span className="set-action">{sessionAttempt ? 'Retry →' : 'Start →'}</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="highlight-strip">
        <div>
          <h2>Keep momentum, not pressure.</h2>
          <p>
            Every answer shows the explanation immediately so you can lock in the facts that matter.
            When you finish, you get a focused recommendation on what to revisit next.
          </p>
        </div>
        <div className="strip-card">
          <p className="strip-label">Focus mode</p>
          <p className="strip-title">20s per question</p>
          <p className="strip-body">Train recall under realistic time pressure.</p>
        </div>
      </section>
    </div>
  );
}
