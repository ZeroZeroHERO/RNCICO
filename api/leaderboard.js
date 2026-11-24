import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const PLAYERS_KEY = 'rncico:players';

function buildTop10(playersMap) {
  return Object.values(playersMap || {})
    .sort((a, b) => {
      if (b.badgesCount !== a.badgesCount) {
        return b.badgesCount - a.badgesCount;
      }
      return b.totalScore - a.totalScore;
    })
    .slice(0, 10)
    .map(({ nickname, badgesCount, totalScore, updatedAt }) => ({
      nickname,
      badgesCount,
      totalScore,
      updatedAt
    }));
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    try {
      const players = (await redis.get(PLAYERS_KEY)) || {};
      return res.status(200).json({ leaderboard: buildTop10(players) });
    } catch (err) {
      return res.status(500).json({ error: 'Errore nel caricamento della classifica.' });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { action, deviceId, nickname, badgesCount, totalScore } = body || {};

      if (!deviceId || typeof deviceId !== 'string') {
        return res.status(400).json({ error: 'Identificativo dispositivo non valido.' });
      }

      const players = (await redis.get(PLAYERS_KEY)) || {};

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
          updatedAt: new Date().toISOString()
        };

        players[deviceId] = newPlayer;
        await redis.set(PLAYERS_KEY, players);

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
            updatedAt: new Date().toISOString()
          };
          await redis.set(PLAYERS_KEY, players);
          return res.status(200).json({ leaderboard: buildTop10(players) });
        }

        if (existing.nickname.toLowerCase() !== (nickname || '').trim().toLowerCase()) {
          return res.status(403).json({ error: 'Corrispondenza account non valida.' });
        }

        existing.badgesCount = Math.max(existing.badgesCount, Math.max(0, Number(badgesCount) || 0));
        existing.totalScore = Math.max(existing.totalScore, Math.max(0, Number(totalScore) || 0));
        existing.updatedAt = new Date().toISOString();

        players[deviceId] = existing;
        await redis.set(PLAYERS_KEY, players);

        return res.status(200).json({ leaderboard: buildTop10(players) });
      }

      return res.status(400).json({ error: 'Azione non supportata.' });
    } catch (err) {
      return res.status(500).json({ error: 'Errore interno del server.' });
    }
  }

  return res.status(405).json({ error: 'Metodo non consentito.' });
}
