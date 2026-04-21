const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const practiceSets = [
  {
    id: 'practice-1',
    name: 'Practice 1',
    questions: [
      {
        id: 'q1',
        questionText: 'What are the three main levels of government in Canada?',
        options: [
          'Federal, provincial, municipal',
          'National, local, indigenous',
          'Royal, provincial, city',
          'Federal, territorial, borough'
        ],
        correctAnswer: 'Federal, provincial, municipal',
        explanation: "Canada's three levels are federal, provincial or territorial, and municipal.",
        topic: 'Government'
      },
      {
        id: 'q2',
        questionText: "Who is Canada's Head of State?",
        options: ['The Prime Minister', 'The Governor General', 'The King', 'The Premier'],
        correctAnswer: 'The King',
        explanation: 'Canada is a constitutional monarchy. The monarch is Head of State.',
        topic: 'Government'
      },
      {
        id: 'q3',
        questionText: 'What is the highest court in Canada?',
        options: ['Federal Court', 'Supreme Court of Canada', 'Court of Appeal', 'Parliament Court'],
        correctAnswer: 'Supreme Court of Canada',
        explanation: 'The Supreme Court of Canada is the final court of appeal.',
        topic: 'Law'
      }
    ]
  },
  {
    id: 'practice-2',
    name: 'Practice 2',
    questions: [
      {
        id: 'q4',
        questionText: 'What do you promise when taking the Oath of Citizenship?',
        options: [
          'Loyalty to Canada and to obey Canadian laws',
          'To vote in every election',
          'To serve in the military',
          'To move to Ottawa'
        ],
        correctAnswer: 'Loyalty to Canada and to obey Canadian laws',
        explanation: 'The oath includes allegiance to Canada and faithful observance of its laws.',
        topic: 'Citizenship'
      },
      {
        id: 'q5',
        questionText: 'Which leaf is on the Canadian flag?',
        options: ['Maple leaf', 'Oak leaf', 'Pine leaf', 'Cedar leaf'],
        correctAnswer: 'Maple leaf',
        explanation: 'The national flag features a stylized red maple leaf.',
        topic: 'Symbols'
      },
      {
        id: 'q6',
        questionText: 'What are the two official languages of Canada?',
        options: ['English and French', 'English and Spanish', 'French and German', 'English and Cree'],
        correctAnswer: 'English and French',
        explanation: 'Canada has two official languages at the federal level: English and French.',
        topic: 'Identity'
      }
    ]
  }
];

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function anonymizeForClient(set) {
  return {
    id: set.id,
    name: set.name,
    questions: set.questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      options: q.options,
      topic: q.topic
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
  if (accuracy < 60) recommendation = 'Review core concepts and retry this set in untimed mode first.';
  else if (accuracy < 80) recommendation = `Focus on ${topicNeedingPractice} and retake tomorrow.`;

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

function serveFile(req, res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath);
    const contentTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json'
    };

    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/api/practice-sets') {
    return sendJson(
      res,
      200,
      practiceSets.map((set) => ({ id: set.id, name: set.name, questionCount: set.questions.length }))
    );
  }

  if (req.method === 'GET' && url.pathname.startsWith('/api/practice-sets/')) {
    const setId = url.pathname.split('/').pop();
    const set = practiceSets.find((s) => s.id === setId);
    if (!set) return sendJson(res, 404, { error: 'Practice set not found' });
    return sendJson(res, 200, anonymizeForClient(set));
  }

  if (req.method === 'POST' && url.pathname === '/api/attempts/grade') {
    try {
      const body = await parseBody(req);
      const set = practiceSets.find((s) => s.id === body.setId);
      if (!set) return sendJson(res, 404, { error: 'Practice set not found' });
      const summary = buildSummary(set, body.answers || {});
      return sendJson(res, 200, summary);
    } catch (error) {
      return sendJson(res, 400, { error: 'Invalid JSON body' });
    }
  }

  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
    return serveFile(req, res, path.join(__dirname, 'index.html'));
  }

  if (req.method === 'GET' && ['/styles.css', '/app.js'].includes(url.pathname)) {
    return serveFile(req, res, path.join(__dirname, url.pathname));
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`CanadaCitizenTest.ca demo server listening on http://localhost:${PORT}`);
});
