import { getStore } from "@netlify/blobs";

const STORE_NAME = "rncico-leaderboard";
const PLAYERS_KEY = "all-players";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

function buildTop10(playersMap) {
  return Object.values(playersMap)
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

export default async (req, context) => {
  const store = getStore(STORE_NAME);

  // GET: Restituisce la Top 10 attuale
  if (req.method === "GET") {
    try {
      const players = (await store.get(PLAYERS_KEY, { type: "json" })) || {};
      return jsonResponse({ leaderboard: buildTop10(players) });
    } catch (err) {
      return jsonResponse({ error: "Errore nel caricamento della classifica." }, 500);
    }
  }

  // POST: Registrazione nuovo account o aggiornamento punteggi/badge
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const { action, deviceId, nickname, badgesCount, totalScore } = body;

      if (!deviceId || typeof deviceId !== "string") {
        return jsonResponse({ error: "Identificativo dispositivo non valido." }, 400);
      }

      const players = (await store.get(PLAYERS_KEY, { type: "json" })) || {};

      // AZIONE 1: Registrazione primo accesso sul dispositivo
      if (action === "register") {
        const cleanNick = (nickname || "").trim();

        if (cleanNick.length < 2 || cleanNick.length > 20) {
          return jsonResponse({ error: "Il nickname deve avere tra 2 e 20 caratteri." }, 400);
        }

        if (!/^[a-zA-Z0-9_.-]+$/.test(cleanNick)) {
          return jsonResponse({ error: "Usa solo lettere, numeri, punti, trattini o underscore." }, 400);
        }

        // Controlla se questo dispositivo ha già un account
        if (players[deviceId]) {
          return jsonResponse({
            player: players[deviceId],
            leaderboard: buildTop10(players)
          });
        }

        // Controlla unicità nickname (case-insensitive)
        const nickTaken = Object.values(players).some(
          (p) => p.nickname.toLowerCase() === cleanNick.toLowerCase()
        );

        if (nickTaken) {
          return jsonResponse({ error: "Questo nickname è già stato preso da un altro giocatore." }, 409);
        }

        const newPlayer = {
          deviceId,
          nickname: cleanNick,
          badgesCount: Math.max(0, Number(badgesCount) || 0),
          totalScore: Math.max(0, Number(totalScore) || 0),
          updatedAt: new Date().toISOString()
        };

        players[deviceId] = newPlayer;
        await store.setJSON(PLAYERS_KEY, players);

        return jsonResponse({
          player: newPlayer,
          leaderboard: buildTop10(players)
        });
      }

      // AZIONE 2: Sincronizzazione/Aggiornamento quando si sblocca un badge
      if (action === "sync") {
        const existing = players[deviceId];

        if (!existing) {
          // Se il blob fosse stato resettato ma il client ha già un profilo locale, lo ripristina se il nick è libero
          const cleanNick = (nickname || "").trim();
          const nickTaken = Object.values(players).some(
            (p) => p.nickname.toLowerCase() === cleanNick.toLowerCase()
          );
          if (!cleanNick || nickTaken) {
            return jsonResponse({ error: "Profilo non trovato sul server." }, 404);
          }

          players[deviceId] = {
            deviceId,
            nickname: cleanNick,
            badgesCount: Math.max(0, Number(badgesCount) || 0),
            totalScore: Math.max(0, Number(totalScore) || 0),
            updatedAt: new Date().toISOString()
          };
          await store.setJSON(PLAYERS_KEY, players);
          return jsonResponse({ leaderboard: buildTop10(players) });
        }

        // Verifica corrispondenza deviceId + nickname
        if (existing.nickname.toLowerCase() !== (nickname || "").trim().toLowerCase()) {
          return jsonResponse({ error: "Corrispondenza account non valida." }, 403);
        }

        const incomingBadges = Math.max(0, Number(badgesCount) || 0);
        const incomingScore = Math.max(0, Number(totalScore) || 0);

        // Mantiene sempre il valore più alto per evitare regressioni
        existing.badgesCount = Math.max(existing.badgesCount, incomingBadges);
        existing.totalScore = Math.max(existing.totalScore, incomingScore);
        existing.updatedAt = new Date().toISOString();

        players[deviceId] = existing;
        await store.setJSON(PLAYERS_KEY, players);

        return jsonResponse({ leaderboard: buildTop10(players) });
      }

      return jsonResponse({ error: "Azione non supportata." }, 400);
    } catch (err) {
      return jsonResponse({ error: "Errore interno del server." }, 500);
    }
  }

  return jsonResponse({ error: "Metodo non consentito." }, 405);
};