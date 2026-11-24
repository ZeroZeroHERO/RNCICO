const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const PLAYERS_KEY = 'rncico:players';

async function kvGet(key) {
  const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`KV GET failed: ${res.status}`);
  const data = await res.json();
  if (!data.result) return {};
  return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
}

async function kvSet(key, value) {
  const res = await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(value)
  });
  if (!res.ok) throw new Error(`KV SET failed: ${res.status}`);
}

function buildTop10(playersMap) {
  return Object.values(playersMap || {})
    .sort((a, b) => {
      if (b.badgesCount !== a.badgesCount) {
        return b.badgesCount - a.badgesCount;
      }
      return b.totalScore - a.totalScore;
    })
    .slice(0, 10)
    .map(({ nickname, badgesCount, totalScore, rollsCount, updatedAt }) => ({
      nickname,
      badgesCount,
      totalScore,
      rollsCount: Number(rollsCount) || 0,
      updatedAt
    }));
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!KV_URL || !KV_TOKEN) {
    return res.status(500).json({ error: 'Variabili KV_REST_API_URL / KV_REST_API_TOKEN mancanti.' });
  }

  if (req.method === 'GET') {
    try {
      const players = await kvGet(PLAYERS_KEY);
      return res.status(200).json({ leaderboard: buildTop10(players) });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { action, deviceId, nickname, badgesCount, totalScore, rollsCount } = body || {};

      if (!deviceId || typeof deviceId !== 'string') {
        return res.status(400).json({ error: 'Identificativo dispositivo non valido.' });
      }

      const players = await kvGet(PLAYERS_KEY);

      if (action === 'register') {
        const cleanNick = (nickname || '').trim();

        if (cleanNick.length < 2 || cleanNick.length > 20) {
          return res.status(400).json({ error: 'Il nickname deve avere tra 2 e 20 caratteri.' });
        }

        if (!/^[a-zA-Z0-9_.-]+$/.test(cleanNick)) {
          return res.status(400).json({ error: 'Usa solo lettere, numeri, punti, trattini o underscore.' });
        }

        if (players[deviceId]) {
          return res.status(200).json({
            player: players[deviceId],
            leaderboard: buildTop10(players)
          });
        }

        const nickTaken = Object.values(players).some(
          (p) => p.nickname.toLowerCase() === cleanNick.toLowerCase()
        );

        if (nickTaken) {
          return res.status(409).json({ error: 'Questo nickname è già stato preso da un altro giocatore.' });
        }

        const newPlayer = {
          deviceId,
          nickname: cleanNick,
          badgesCount: Math.max(0, Number(badgesCount) || 0),
          totalScore: Math.max(0, Number(totalScore) || 0),
          rollsCount: Math.max(0, Number(rollsCount) || 0),
          updatedAt: new Date().toISOString()
        };

        players[deviceId] = newPlayer;
        await kvSet(PLAYERS_KEY, players);

        return res.status(200).json({
          player: newPlayer,
          leaderboard: buildTop10(players)
        });
      }

      if (action === 'sync') {
        const existing = players[deviceId];

        if (!existing) {
          const cleanNick = (nickname || '').trim();
          const nickTaken = Object.values(players).some(
            (p) => p.nickname.toLowerCase() === cleanNick.toLowerCase()
          );
          if (!cleanNick || nickTaken) {
            return res.status(404).json({ error: 'Profilo non trovato sul server.' });
          }

          players[deviceId] = {
            deviceId,
            nickname: cleanNick,
            badgesCount: Math.max(0, Number(badgesCount) || 0),
            totalScore: Math.max(0, Number(totalScore) || 0),
            rollsCount: Math.max(0, Number(rollsCount) || 0),
            updatedAt: new Date().toISOString()
          };
          await kvSet(PLAYERS_KEY, players);
          return res.status(200).json({ leaderboard: buildTop10(players) });
        }

        if (existing.nickname.toLowerCase() !== (nickname || '').trim().toLowerCase()) {
          return res.status(403).json({ error: 'Corrispondenza account non valida.' });
        }

        existing.badgesCount = Math.max(existing.badgesCount, Math.max(0, Number(badgesCount) || 0));
        existing.totalScore = Math.max(existing.totalScore, Math.max(0, Number(totalScore) || 0));
        existing.rollsCount = Math.max(Number(existing.rollsCount) || 0, Math.max(0, Number(rollsCount) || 0));
        existing.updatedAt = new Date().toISOString();

        players[deviceId] = existing;
        await kvSet(PLAYERS_KEY, players);

        return res.status(200).json({ leaderboard: buildTop10(players) });
      }

      return res.status(400).json({ error: 'Azione non supportata.' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Metodo non consentito.' });
}
