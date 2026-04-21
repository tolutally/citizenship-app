const { practiceSets } = require('../data/practiceSets');
const { parseBody, sendJson } = require('../utils/http');
const { anonymizeForClient, buildSummary } = require('../utils/summary');
const { dedupeQuestions, extractQuestionsAndAnswers, generatePracticeSets, normalizeText } = require('../services/extraction');

let importedTranscript = '';
let lastExtractedQuestions = [];

async function handleApiRoutes(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/practice-sets') {
    sendJson(
      res,
      200,
      practiceSets.map((set) => ({
        id: set.id,
        name: set.name,
        questionCount: set.questions.length
      }))
    );
    return true;
  }

  if (req.method === 'GET' && url.pathname.startsWith('/api/practice-sets/')) {
    const setId = url.pathname.split('/').pop();
    const set = practiceSets.find((item) => item.id === setId);

    if (!set) {
      sendJson(res, 404, { error: 'Practice set not found' });
      return true;
    }

    sendJson(res, 200, anonymizeForClient(set));
    return true;
  }

  if (req.method === 'POST' && url.pathname === '/api/transcripts/import') {
    try {
      const body = await parseBody(req);
      const incomingText = normalizeText(body.transcript || body.text || '');

      if (!incomingText) {
        sendJson(res, 400, { error: 'transcript text is required' });
        return true;
      }

      importedTranscript = incomingText;
      lastExtractedQuestions = [];

      sendJson(res, 200, {
        message: 'Transcript imported successfully',
        characters: importedTranscript.length,
        lines: importedTranscript.split('\n').filter(Boolean).length
      });
      return true;
    } catch (error) {
      sendJson(res, 400, { error: 'Invalid JSON body' });
      return true;
    }
  }

  if (req.method === 'POST' && url.pathname === '/api/questions/extract') {
    try {
      const body = await parseBody(req);
      const sourceText = normalizeText(body.transcript || body.text || importedTranscript);

      if (!sourceText) {
        sendJson(res, 400, { error: 'transcript text is required (body.transcript or import first)' });
        return true;
      }

      const questions = extractQuestionsAndAnswers(sourceText);
      lastExtractedQuestions = questions;

      sendJson(res, 200, {
        questionCount: questions.length,
        questions
      });
      return true;
    } catch (error) {
      sendJson(res, 400, { error: 'Invalid JSON body' });
      return true;
    }
  }

  if (req.method === 'POST' && url.pathname === '/api/practice/generate') {
    try {
      const body = await parseBody(req);
      const chunkSize = Number(body.chunkSize) > 0 ? Number(body.chunkSize) : 20;
      const incomingQuestions = Array.isArray(body.questions) ? dedupeQuestions(body.questions) : [];
      const questionsSource = incomingQuestions.length > 0 ? incomingQuestions : lastExtractedQuestions;

      if (!questionsSource.length) {
        sendJson(res, 400, { error: 'No questions available. Extract questions or provide body.questions first.' });
        return true;
      }

      const practiceSetChunks = generatePracticeSets(questionsSource, chunkSize);

      sendJson(res, 200, {
        chunkSize,
        setCount: practiceSetChunks.length,
        sets: practiceSetChunks
      });
      return true;
    } catch (error) {
      sendJson(res, 400, { error: 'Invalid JSON body' });
      return true;
    }
  }

  if (req.method === 'POST' && url.pathname === '/api/attempts/grade') {
    try {
      const body = await parseBody(req);
      const set = practiceSets.find((item) => item.id === body.setId);

      if (!set) {
        sendJson(res, 404, { error: 'Practice set not found' });
        return true;
      }

      const summary = buildSummary(set, body.answers || {});
      sendJson(res, 200, summary);
      return true;
    } catch (error) {
      sendJson(res, 400, { error: 'Invalid JSON body' });
      return true;
    }
  }

  return false;
}

module.exports = { handleApiRoutes };
