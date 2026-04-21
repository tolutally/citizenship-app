function anonymizeForClient(set) {
  return {
    id: set.id,
    name: set.name,
    questions: set.questions.map((question) => ({
      id: question.id,
      questionText: question.questionText,
      options: question.options,
      topic: question.topic
    }))
  };
}

function buildSummary(set, answers) {
  const total = set.questions.length;
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
      userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      explanation: question.explanation
    };
  });

  const accuracy = Math.round((correct / total) * 100);
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
    accuracy,
    topicNeedingPractice,
    recommendation,
    results
  };
}

module.exports = {
  anonymizeForClient,
  buildSummary
};
