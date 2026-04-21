const { practiceSets } = require('../data/practiceSets');
const { parseBody, sendJson } = require('../utils/http');
const { anonymizeForClient, buildSummary } = require('../utils/summary');

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
