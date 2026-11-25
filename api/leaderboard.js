const PLAYERS_KEY = 'rncico:players';
const KING_MSG_KEY = 'rncico:king_message';

async function kvGet(key) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error('Variabili KV_REST_API_URL o KV_REST_API_TOKEN mancanti.');
  }

  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!data || data.result === null || data.result === undefined) return null;
  return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
}

async function kvSet(key, value) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error('Variabili KV_REST_API_URL o KV_REST_API_TOKEN mancanti.');
  }

  const res = await fetch(`${url}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(value)
  });
  return res.json();
}

function buildTop10(playersMap) {
  return Object.values(playersMap)
    .sort((a, b) => {
      if (b.badgesCount !== a.badgesCount) return b.badgesCount - a.badgesCount;
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return (a.updatedAt || 0) - (b.updatedAt || 0);
    })
    .slice(0, 10)
    .map(({ deviceId, nickname, badgesCount, totalScore, rollsCount }) => ({
      deviceId,
      nickname,
      badgesCount,
      totalScore,
      rollsCount: Number(rollsCount) || 0
    }));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const players = (await kvGet(PLAYERS_KEY)) || {};
    let kingMessage = (await kvGet(KING_MSG_KEY)) || null;

    if (req.method === 'GET') {
      return res.status(200).json({
        leaderboard: buildTop10(players),
        kingMessage
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { action, deviceId, nickname, badgesCount, totalScore, rollsCount, message } = body || {};

      if (!deviceId || typeof deviceId !== 'string') {
        return res.status(400).json({ error: 'Device ID non valido.' });
      }

      if (action === 'set_king_message') {
        const top10 = buildTop10(players);
        const king = top10[0];
        if (!king || king.deviceId !== deviceId) {
          return res.status(403).json({ error: 'Solo il primo in classifica può scrivere il messaggio!' });
        }

        const cleanMsg = String(message || '').trim().slice(0, 140);
        if (!cleanMsg) {
          kingMessage = null;
        } else {
          kingMessage = {
            author: king.nickname,
            text: cleanMsg,
            updatedAt: Date.now()
          };
        }

        await kvSet(KING_MSG_KEY, kingMessage);
        return res.status(200).json({
          leaderboard: top10,
          kingMessage
        });
      }

      const cleanNick = String(nickname || '').trim();
      if (cleanNick.length < 2 || cleanNick.length > 20) {
        return res.status(400).json({ error: 'Il nickname deve avere tra 2 e 20 caratteri.' });
      }

      const existing = players[deviceId];

      if (action === 'register') {
        if (existing) {
          return res.status(200).json({
            player: existing,
            leaderboard: buildTop10(players),
            kingMessage
          });
        }

        const nickTaken = Object.values(players).some(
          p => p.nickname.toLowerCase() === cleanNick.toLowerCase()
        );
        if (nickTaken) {
          return res.status(409).json({ error: 'Questo nickname è già usato da un altro giocatore!' });
        }

        players[deviceId] = {
          deviceId,
          nickname: cleanNick,
          badgesCount: Number(badgesCount) || 0,
          totalScore: Number(totalScore) || 0,
          rollsCount: Number(rollsCount) || 0,
          updatedAt: Date.now()
        };

        await kvSet(PLAYERS_KEY, players);
        return res.status(201).json({
          player: players[deviceId],
          leaderboard: buildTop10(players),
          kingMessage
        });
      }

      if (action === 'rename') {
        if (!existing) {
          return res.status(404).json({ error: 'Profilo non trovato.' });
        }

        const nickTakenByOthers = Object.entries(players).some(
          ([id, p]) => id !== deviceId && p.nickname.toLowerCase() === cleanNick.toLowerCase()
        );
        if (nickTakenByOthers) {
          return res.status(409).json({ error: 'Questo nickname è già usato da un altro giocatore!' });
        }

        players[deviceId] = {
          ...existing,
          nickname: cleanNick,
          updatedAt: Date.now()
        };

        // Aggiorna anche l'autore del messaggio del re se il #1 ha cambiato nome
        const newTop10 = buildTop10(players);
        if (newTop10[0] && newTop10[0].deviceId === deviceId && kingMessage) {
          kingMessage = {
            ...kingMessage,
            author: cleanNick
          };
          await kvSet(KING_MSG_KEY, kingMessage);
        }

        await kvSet(PLAYERS_KEY, players);
        return res.status(200).json({
          player: players[deviceId],
          leaderboard: newTop10,
          kingMessage
        });
      }

      if (action === 'sync') {
        if (!existing) {
          return res.status(404).json({ error: 'Dispositivo non registrato.' });
        }

        const incomingRolls = Number(rollsCount);
        players[deviceId] = {
          ...existing,
          nickname: existing.nickname,
          badgesCount: Math.max(existing.badgesCount || 0, Number(badgesCount) || 0),
          totalScore: Math.max(existing.totalScore || 0, Number(totalScore) || 0),
          rollsCount: Number.isFinite(incomingRolls)
            ? Math.max(existing.rollsCount || 0, incomingRolls)
            : (existing.rollsCount || 0),
          updatedAt: Date.now()
        };

        await kvSet(PLAYERS_KEY, players);
        return res.status(200).json({
          player: players[deviceId],
          leaderboard: buildTop10(players),
          kingMessage
        });
      }

      return res.status(400).json({ error: 'Azione non riconosciuta.' });
    }

    return res.status(405).json({ error: 'Metodo non consentito.' });
  } catch (err) {
    console.error('Errore API leaderboard:', err);
    return res.status(500).json({ error: 'Errore interno del server.' });
  }
}
