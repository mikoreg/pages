const MAX_LIMIT = 50;

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = String(env.ALLOWED_ORIGINS || 'https://mikoreg.github.io')
    .split(',').map(x => x.trim()).filter(Boolean);
  const local = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const ok = !origin || local || allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? (origin || allowed[0] || '*') : 'null',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Accept',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
    'Cache-Control': 'no-store'
  };
}

function json(request, env, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {'Content-Type': 'application/json; charset=utf-8', ...corsHeaders(request, env)}
  });
}

function cleanNick(value) {
  return String(value || '').toUpperCase().replace(/[^0-9A-ZĄĆĘŁŃÓŚŹŻ _.-]/gi, '')
    .replace(/\s+/g, ' ').trim().slice(0, 12);
}

async function topScores(env, limit = 10) {
  const n = Math.max(1, Math.min(MAX_LIMIT, Number(limit) || 10));
  const {results = []} = await env.DB.prepare(`
    SELECT id, nick, score, seconds, mode,
           CAST(strftime('%s', created_at) AS INTEGER) * 1000 AS createdAt
    FROM scores
    ORDER BY score DESC, seconds ASC, id ASC
    LIMIT ?
  `).bind(n).all();
  return results;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = String(env.ALLOWED_ORIGINS || 'https://mikoreg.github.io')
      .split(',').map(x => x.trim()).filter(Boolean);
    const local = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (origin && !local && !allowed.includes(origin)) {
      return json(request, env, {error: 'Origin not allowed'}, 403);
    }

    if (request.method === 'OPTIONS') return new Response(null, {status: 204, headers: corsHeaders(request, env)});

    const url = new URL(request.url);
    if (url.pathname === '/' && request.method === 'GET') {
      return json(request, env, {ok: true, service: 'capital-rush-leaderboard'});
    }

    if (url.pathname === '/scores' && request.method === 'GET') {
      return json(request, env, {scores: await topScores(env, url.searchParams.get('limit'))});
    }

    if (url.pathname === '/scores' && request.method === 'POST') {
      let body;
      try { body = await request.json(); }
      catch { return json(request, env, {error: 'Invalid JSON'}, 400); }

      const nick = cleanNick(body.nick);
      const score = Number(body.score);
      const seconds = Number(body.seconds);
      const mode = Number(body.mode);

      if (nick.length < 2 || nick.length > 12) return json(request, env, {error: 'Invalid nick'}, 400);
      if (!Number.isInteger(score) || score < 0 || score > 4200) return json(request, env, {error: 'Invalid score'}, 400);
      if (!Number.isInteger(seconds) || seconds < 1 || seconds > 86400) return json(request, env, {error: 'Invalid time'}, 400);
      if (![1,2,3,4].includes(mode)) return json(request, env, {error: 'Invalid mode'}, 400);

      const result = await env.DB.prepare(
        'INSERT INTO scores (nick, score, seconds, mode) VALUES (?, ?, ?, ?)'
      ).bind(nick, score, seconds, mode).run();

      const id = result.meta?.last_row_id;
      const record = {id, nick, score, seconds, mode, createdAt: Date.now()};
      return json(request, env, {record, scores: await topScores(env, 10)}, 201);
    }

    return json(request, env, {error: 'Not found'}, 404);
  }
};
