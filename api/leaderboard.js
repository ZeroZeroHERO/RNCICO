const PLAYERS_KEY = 'rncico:players';
const KING_MSG_KEY = 'rncico:king_message';
const SUPER_UNLOCKERS_KEY = 'rncico:super_unlockers';
const LATEST_SUPER_ANN_KEY = 'rncico:latest_super_announcement';

const MIN_NUM = 0;
const MAX_NUM = 500;
const TOTAL_NUMBERS = MAX_NUM - MIN_NUM + 1;

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function isFactorial(n) {
  return [1, 2, 6, 24, 120].includes(n);
}

function isPalindrome(n) {
  const s = String(n);
  return s.length > 1 && s === s.split('').reverse().join('');
}

function isPerfectSquare(n) {
  return n > 0 && Number.isInteger(Math.sqrt(n));
}

function isHarshad(n) {
  if (n <= 0) return false;
  const sumDigits = String(n).split('').reduce((acc, d) => acc + Number(d), 0);
  return n % sumDigits === 0;
}

function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

function isBinaryDigits(n) {
  return /^[01]+$/.test(String(n));
}

function isPerfectNumber(n) {
  return [6, 28, 496].includes(n);
}

function isFibonacci(n) {
  return [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377].includes(n);
}

function isDivisorOf496(n) {
  return n > 0 && 496 % n === 0;
}

function isUpsideDownSame(n) {
  const map = { '0': '0', '1': '1', '6': '9', '8': '8', '9': '6' };
  const s = String(n);
  const flipped = s.split('').reverse().map(c => map[c] || '').join('');
  return s === flipped;
}

const RAW_BADGES = [
  { id: 'n0', check: (n) => n === 0 },
  { id: 'n1', check: (n) => n === 1 },
  { id: 'n2', check: (n) => n === 2 },
  { id: 'n3', check: (n) => n === 3 },
  { id: 'n4', check: (n) => n === 4 },
  { id: 'n6', check: (n) => n === 6 },
  { id: 'n9', check: (n) => n === 9 },
  { id: 'n10', check: (n) => n === 10 },
  { id: 'n11', check: (n) => n === 11 },
  { id: 'n12', check: (n) => n === 12 },
  { id: 'n18', check: (n) => n === 18 },
  { id: 'n18_spaziali', check: (n) => n === 18 },
  { id: 'n24', check: (n) => n === 24 },
  { id: 'n31', check: (n) => n === 31 },
  { id: 'n33', check: (n) => n === 33 },
  { id: 'n35', check: (n) => n === 35 },
  { id: 'n36_smalto', check: (n) => n === 36 },
  { id: 'n48', check: (n) => n === 48 },
  { id: 'n51', check: (n) => n === 51 },
  { id: 'n52', check: (n) => n === 52 },
  { id: 'n70', check: (n) => n === 70 },
  { id: 'n71', check: (n) => n === 71 },
  { id: 'n82', check: (n) => n === 82 },
  { id: 'n90', check: (n) => n === 90 },
  { id: 'n91', check: (n) => n === 91 },
  { id: 'n92', check: (n) => n === 92 },
  { id: 'n93', check: (n) => n === 93 },
  { id: 'n94', check: (n) => n === 94 },
  { id: 'n100_stamps', check: (n) => n === 100 },
  { id: 'n109', check: (n) => n === 109 },
  { id: 'n110_daniele', check: (n) => n === 110 },
  { id: 'n118', check: (n) => n === 118 },
  { id: 'n119', check: (n) => n === 119 },
  { id: 'n123', check: (n) => n === 123 },
  { id: 'n126', check: (n) => n === 126 },
  { id: 'n127', check: (n) => n === 127 },
  { id: 'n141', check: (n) => n === 141 },
  { id: 'n166', check: (n) => n === 166 },
  { id: 'n190', check: (n) => n === 190 },
  { id: 'n193_cap', check: (n) => n === 193 },
  { id: 'n195', check: (n) => n === 195 },
  { id: 'n198_cr', check: (n) => n === 198 },
  { id: 'n206', check: (n) => n === 206 },
  { id: 'n216', check: (n) => n === 216 },
  { id: 'n271', check: (n) => n === 271 },
  { id: 'n271_benjamin', check: (n) => n === 271 },
  { id: 'n286', check: (n) => n === 286 },
  { id: 'n287', check: (n) => n === 287 },
  { id: 'n297', check: (n) => n === 297 },
  { id: 'n312', check: (n) => n === 312 },
  { id: 'n314', check: (n) => n === 314 },
  { id: 'n343', check: (n) => n === 343 },
  { id: 'n350', check: (n) => n === 350 },
  { id: 'n365', check: (n) => n === 365 },
  { id: 'n373', check: (n) => n === 373 },
  { id: 'n401_nanda', check: (n) => n === 401 },
  { id: 'n404', check: (n) => n === 404 },
  { id: 'n412', check: (n) => n === 412 },
  { id: 'n420', check: (n) => n === 420 },
  { id: 'n441', check: (n) => n === 441 },
  { id: 'n500', check: (n) => n === 500 },
  { id: 'siri_timer', check: (n) => n === 5 || n === 300 },
  { id: 'coc_troops', check: (n) => n === 352 || n === 407 },
  { id: 'meta_expected', check: (n) => n === 250 || n === 251 },
  { id: 'tel_cico', check: (n) => n === 391 },
  { id: 'tel_cico_rev', check: (n) => n === 193 },
  { id: 'tel_carlo', check: (n) => n === 380 },
  { id: 'tel_carlo_rev', check: (n) => n === 83 },
  { id: 'tel_cris_emma', check: (n) => n === 327 },
  { id: 'tel_ila', check: (n) => n === 324 },
  { id: 'tel_ila_rev', check: (n) => n === 423 },
  { id: 'cont89', check: (n) => String(n).includes('89') },
  { id: 'cont69', check: (n) => String(n).includes('69') },
  { id: 'cont67', check: (n) => String(n).includes('67') },
  { id: 'cont23', check: (n) => String(n).includes('23') },
  { id: 'cont77', check: (n) => String(n).includes('77') },
  { id: 'end26', check: (n) => n % 100 === 26 },
  { id: 'end22', check: (n) => n % 100 === 22 },
  { id: 'end88', check: (n) => n % 100 === 88 },
  { id: 'near100', check: (n) => n % 100 === 99 || n % 100 === 1 },
  { id: 'end2', check: (n) => n % 10 === 2 },
  { id: 'end4', check: (n) => n % 10 === 4 },
  { id: 'end6', check: (n) => n % 10 === 6 },
  { id: 'end8', check: (n) => n % 10 === 8 },
  { id: 'under10', check: (n) => n >= 1 && n <= 9 },
  { id: 'alphabet', check: (n) => n >= 1 && n <= 26 },
  { id: 'over490', check: (n) => n > 490 },
  { id: 'carlo_sides', check: (n) => n >= 40 && n <= 50 },
  { id: 'cico_mom', check: (n) => n >= 105 && n <= 124 },
  { id: 'leo_aviator', check: (n) => n >= 325 && n <= 335 },
  { id: 'emma_debt', check: (n) => n >= 375 && n <= 385 },
  { id: 'cannora_early', check: (n) => n >= 415 && n <= 419 },
  { id: 'cannora_late', check: (n) => n >= 421 && n <= 424 },
  { id: 'vale_cannore', check: (n) => n >= 430 && n <= 439 },
  { id: 'luce_carlo', check: (n) => n >= 380 && n <= 450 },
  { id: 'odd', check: (n) => n % 2 !== 0 },
  { id: 'even', check: (n) => n % 2 === 0 },
  { id: 'prime', check: (n) => isPrime(n) },
  { id: 'square', check: (n) => isPerfectSquare(n) },
  { id: 'palindrome', check: (n) => isPalindrome(n) },
  { id: 'repdigit', check: (n) => n >= 10 && new Set(String(n)).size === 1 },
  { id: 'upside_down', check: (n) => isUpsideDownSame(n) },
  { id: 'mult50', check: (n) => n > 0 && n % 50 === 0 },
  { id: 'mult70', check: (n) => n > 0 && n % 70 === 0 },
  { id: 'mult37', check: (n) => n > 0 && n % 37 === 0 },
  { id: 'mult100', check: (n) => n > 0 && n % 100 === 0 },
  { id: 'mult104', check: (n) => n > 0 && n % 104 === 0 },
  { id: 'pow2', check: (n) => isPowerOfTwo(n) },
  { id: 'factorial', check: (n) => isFactorial(n) },
  { id: 'harshad', check: (n) => isHarshad(n) },
  { id: 'binary', check: (n) => isBinaryDigits(n) },
  { id: 'perfect', check: (n) => isPerfectNumber(n) },
  { id: 'fibonacci', check: (n) => isFibonacci(n) },
  { id: 'div97', check: (n) => n === 1 || n === 97 },
  { id: 'div496', check: (n) => isDivisorOf496(n) },
  { id: 'self_pow', check: (n) => [1, 4, 27, 256].includes(n) },
  // Nuovi badge
  { id: 'gradi', check: (n) => n === 200 || n === 360 },
  { id: 'n67_sixseven', check: (n) => n === 67 },
  { id: 'n321', check: (n) => n === 321 },
  { id: 'n123_stella', check: (n) => n === 123 },
  { id: 'n7', check: (n) => n === 7 },
  { id: 'n191', check: (n) => n === 191 },
  { id: 'n8', check: (n) => n === 8 },
  { id: 'mending', check: (n) => n >= 1 && n <= 38 },
  { id: 'n110_unodieci', check: (n) => n === 110 },
  { id: 'n366', check: (n) => n === 366 },
  { id: 'n271_memoria', check: (n) => n === 271 },
  { id: 'n34', check: (n) => n === 34 },
  { id: 'n76', check: (n) => n === 76 },
  { id: 'n151', check: (n) => n === 151 },
  { id: 'n20', check: (n) => n === 20 },
  { id: 'n100_laurea', check: (n) => n === 100 },
  { id: 'cannora_frazione', check: (n) => n === 210 || n === 140 || n === 105 },
  { id: 'n25', check: (n) => n === 25 },
  { id: 'n101_carica', check: (n) => n === 101 },
  { id: 'elem_se', check: (n) => n === 34 },
  { id: 'elem_sr', check: (n) => n === 38 },
  { id: 'elem_w', check: (n) => n === 74 },
  { id: 'elem_es', check: (n) => n === 99 },
  { id: 'elem_rf', check: (n) => n === 104 },
  { id: 'mc_ores', check: (n) => [263, 264, 265, 266, 331, 351, 388, 406].includes(n) }
];

const BADGE_CATALOG = new Map();
RAW_BADGES.forEach(badge => {
  let matchingCount = 0;
  for (let i = MIN_NUM; i <= MAX_NUM; i++) {
    if (badge.check(i)) matchingCount++;
  }
  const probability = matchingCount / TOTAL_NUMBERS;
  const points = matchingCount > 0 ? Math.round(100 / probability) : 0;
  BADGE_CATALOG.set(badge.id, { ...badge, points });
});

// Numero della data di oggi (ora italiana): gg/mm fino a settembre, mm/gg per ottobre-dicembre
// (solo se il giorno ha una cifra). null nei giorni in cui non può uscire.
function getTodayDateNumber(date = new Date()) {
  const parts = new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', day: 'numeric', month: 'numeric' })
    .formatToParts(date);
  const day = Number(parts.find(p => p.type === 'day').value);
  const month = Number(parts.find(p => p.type === 'month').value);
  if (month <= 9) return Number(`${day}${month}`);
  if (day <= 9) return Number(`${month}${day}`);
  return null;
}

// Ora attuale (ora italiana, 24h) come numero: 03:51 → 351, 00:07 → 7. null dopo le 05:00.
function getNowTimeNumber(date = new Date()) {
  const parts = new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
    .formatToParts(date);
  const hour = Number(parts.find(p => p.type === 'hour').value);
  const minute = Number(parts.find(p => p.type === 'minute').value);
  const n = hour * 100 + minute;
  return n <= MAX_NUM ? n : null;
}

// Super Badge (punti tripli = probDenominator * 3)
const SUPER_BADGES_CATALOG = [
  {
    id: 'super_deja_vu',
    name: 'DÉJÀ VU',
    probDenominator: 501,
    points: Math.round((100 / (1 / 501)) * 3),
    check: (rolls) => rolls.length >= 2 && rolls[rolls.length - 1] === rolls[rolls.length - 2]
  },
  {
    id: 'super_collo_terrorista',
    name: 'COLLO TERRORISTA',
    probDenominator: 775,
    points: Math.round((100 / (1 / 775)) * 3),
    check: (rolls) => {
      if (rolls.length < 3) return false;
      const last3 = rolls.slice(-3);
      return last3[0] + last3[1] + last3[2] === 911;
    }
  },
  {
    id: 'super_fanatico_harshad',
    name: 'FANATICO DI HARSHAD',
    probDenominator: 919,
    points: Math.round((100 / (1 / 919)) * 3),
    check: (rolls) => rolls.length >= 5 && rolls.slice(-5).every(n => isHarshad(n))
  },
  {
    id: 'super_in_pari',
    name: 'IN PARI',
    probDenominator: 1003,
    points: Math.round((100 / (1 / 1003)) * 3),
    check: (rolls) => rolls.length >= 10 && rolls.slice(-10).every(n => n % 2 === 0)
  },
  {
    id: 'super_indeciso',
    name: 'INDECISO',
    probDenominator: 1255,
    points: Math.round((100 / (1 / 1255)) * 3),
    check: (rolls) => {
      if (rolls.length < 2) return false;
      const a = rolls[rolls.length - 2];
      const b = rolls[rolls.length - 1];
      return (a < 10 && b > 490) || (a > 490 && b < 10);
    }
  },
  {
    id: 'super_data_oggi',
    name: 'DATA DI OGGI',
    probDenominator: 608,
    points: Math.round((100 / (1 / 608)) * 3),
    check: (rolls) => rolls.length >= 1 && rolls[rolls.length - 1] === getTodayDateNumber()
  },
  {
    id: 'super_spaccato',
    name: 'SPACCATO AL MINUTO',
    probDenominator: 2397,
    points: Math.round((100 / (1 / 2397)) * 3),
    check: (rolls) => rolls.length >= 1 && rolls[rolls.length - 1] === getNowTimeNumber()
  }
];

// Massimo teorico di una singola roll: serve a scartare valori di "miglior roll" impossibili
const MAX_POSSIBLE_ROLL = (() => {
  let bestNormal = 0;
  for (let n = MIN_NUM; n <= MAX_NUM; n++) {
    let sum = 0;
    for (const b of BADGE_CATALOG.values()) if (b.check(n)) sum += b.points;
    bestNormal = Math.max(bestNormal, sum);
  }
  const allSuper = SUPER_BADGES_CATALOG.reduce((acc, sb) => acc + sb.points, 0);
  return Math.ceil((bestNormal + allSuper) * Math.pow(2, SUPER_BADGES_CATALOG.length) * 1.2);
})();

function cleanClaimedNumber(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= MIN_NUM && n <= MAX_NUM ? n : null;
}

const MAX_MULTIPLIER = Math.pow(2, 6) * 1.2;

function cleanMultiplier(value) {
  const m = Number(value);
  if (!Number.isFinite(m) || m <= 0 || m > MAX_MULTIPLIER) return 1;
  return Math.round(m * 100) / 100;
}

// Tiene la roll con più punti tra quella salvata e i candidati.
// A parità di punti, completa i dettagli (numero, super, moltiplicatore) se mancavano.
function pickBestRoll(existing, candidates) {
  let best = {
    points: Number(existing.bestRollPoints) || 0,
    number: typeof existing.bestRollNumber === 'number' ? existing.bestRollNumber : null,
    superIds: Array.isArray(existing.bestRollSuperIds) ? existing.bestRollSuperIds : [],
    multiplier: typeof existing.bestRollMultiplier === 'number' ? existing.bestRollMultiplier : 1
  };
  for (const c of candidates) {
    if (!c) continue;
    if (c.points > best.points) {
      best = c;
    } else if (c.points === best.points && best.number === null && c.number !== null) {
      best = c;
    }
  }
  return {
    bestRollPoints: best.points,
    bestRollNumber: best.number,
    bestRollSuperIds: best.superIds || [],
    bestRollMultiplier: typeof best.multiplier === 'number' ? best.multiplier : 1
  };
}

// Super badge ottenuti finora secondo le roll salvate nel browser del giocatore (mai più dei tiri fatti)
function cleanSuperTimesClaim(value, rollsCount) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(n, Math.max(0, Number(rollsCount) || 0));
}

function claimFromBody(body) {
  const points = cleanClaimedBest(body.bestRollScore);
  if (!points) return null;
  return {
    points,
    number: cleanClaimedNumber(body.bestRollNumber),
    superIds: sanitizeIdList(body.bestRollSuperIds, SUPER_BADGE_MAP),
    multiplier: cleanMultiplier(body.bestRollMultiplier)
  };
}

function cleanClaimedBest(value) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n) || n <= 0 || n > MAX_POSSIBLE_ROLL) return 0;
  return n;
}

const SUPER_BADGE_MAP = new Map(SUPER_BADGES_CATALOG.map(sb => [sb.id, sb]));

// Moltiplicatori di punti per roll
const HARD_MODE_MULTIPLIER = 1.2;
const SPEEDRUN_MULTIPLIER = 0.5;
const SUPER_BADGE_ROLL_MULTIPLIER = 2;

const VALID_SECRET_IDS = new Set([
  'secret_cookie',
  'secret_daltonico',
  'secret_mostro',
  'secret_frettolone',
  'secret_nontivantare',
  'secret_nottambulo',
  'secret_tryharder',
  'secret_impasible',
  'secret_nonguardavi',
  'secret_shaker'
]);

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

function sanitizeIdList(list, allowedSetOrMap) {
  if (!Array.isArray(list)) return [];
  const out = [];
  const seen = new Set();
  for (const id of list) {
    if (typeof id === 'string' && !seen.has(id) && allowedSetOrMap.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

function sanitizeRecentRolls(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map(n => Number(n))
    .filter(n => Number.isInteger(n) && n >= MIN_NUM && n <= MAX_NUM)
    .slice(-10);
}

function calculateMinimumScoreForBadges(unlockedIds, secretUnlockedIds, superUnlockedIds = []) {
  let sum = 0;
  for (const id of unlockedIds) {
    const b = BADGE_CATALOG.get(id);
    if (b) sum += b.points;
  }
  for (const id of superUnlockedIds) {
    const sb = SUPER_BADGE_MAP.get(id);
    if (sb) sum += sb.points;
  }
  sum += secretUnlockedIds.length * 67;
  return sum;
}

function normalizePlayerRecord(player) {
  const cleanUnlocked = sanitizeIdList(player.unlockedIds, BADGE_CATALOG);
  const cleanSecrets = sanitizeIdList(player.secretUnlockedIds, VALID_SECRET_IDS);
  const cleanSupers = sanitizeIdList(player.superUnlockedIds, SUPER_BADGE_MAP);
  const cleanRecentRolls = sanitizeRecentRolls(player.recentRolls);
  const minScoreFromBadges = calculateMinimumScoreForBadges(cleanUnlocked, cleanSecrets, cleanSupers);

  const isCrisAccount =
    player.nickname && player.nickname.toLowerCase() === 'crissupergay69';

  if (
    isCrisAccount &&
    (Number(player.totalScore) >= 6000000000 ||
      (Number(player.totalScore) === 0 && Number(player.badgesCount) === 0))
  ) {
    const restoredCount = Math.max(83, cleanUnlocked.length + cleanSecrets.length + cleanSupers.length);
    const restoredScore = Math.max(3426767, minScoreFromBadges);
    const restoredRolls = Math.max(Number(player.rollsCount) || 0, 1);

    return {
      ...player,
      unlockedIds: cleanUnlocked,
      secretUnlockedIds: cleanSecrets,
      superUnlockedIds: cleanSupers,
      recentRolls: cleanRecentRolls,
      badgesCount: restoredCount,
      totalScore: restoredScore,
      rollsCount: restoredRolls,
      serverVerified: false,
      needsLegacyRecovery: true
    };
  }

  const effectiveBadgesCount =
    player.serverVerified && !player.needsLegacyRecovery
      ? cleanUnlocked.length + cleanSecrets.length + cleanSupers.length
      : Math.max(Number(player.badgesCount) || 0, cleanUnlocked.length + cleanSecrets.length + cleanSupers.length);

  const effectiveScore = Math.max(Number(player.totalScore) || 0, minScoreFromBadges);

  return {
    ...player,
    unlockedIds: cleanUnlocked,
    secretUnlockedIds: cleanSecrets,
    superUnlockedIds: cleanSupers,
    recentRolls: cleanRecentRolls,
    badgesCount: effectiveBadgesCount,
    totalScore: effectiveScore,
    rollsCount: Math.max(0, Number(player.rollsCount) || 0)
  };
}

// Valore di ogni classifica per un giocatore
const LEADERBOARD_METRICS = {
  badges: p => Number(p.badgesCount) || 0,
  best: p => Number(p.bestRollPoints) || 0,
  score: p => Number(p.totalScore) || 0,
  rolls: p => Number(p.rollsCount) || 0,
  super: p => getSuperTimes(p),
  combo: p => Number(p.bestCombo) || 0
};

// Ordina per valore; a parità, è più in alto chi ha raggiunto quel valore per ultimo
const LEADERBOARD_SORTS = {};
for (const [key, metric] of Object.entries(LEADERBOARD_METRICS)) {
  LEADERBOARD_SORTS[key] = (a, b) =>
    (metric(b) - metric(a)) ||
    (((b.reachedAt || {})[key] || 0) - ((a.reachedAt || {})[key] || 0));
}

// Segna il momento in cui ogni valore di classifica è cambiato
function withReachedAt(before, after) {
  const now = Date.now();
  const reachedAt = { ...(before && before.reachedAt ? before.reachedAt : {}) };
  for (const [key, metric] of Object.entries(LEADERBOARD_METRICS)) {
    if (!before || metric(after) !== metric(before)) reachedAt[key] = now;
  }
  return { ...after, reachedAt };
}

function getSuperTimes(p) {
  if (typeof p.superTimesCount === 'number') return p.superTimesCount;
  return (p.superUnlockedIds || []).length;
}

function buildTop10(playersMap, sortKey = 'badges') {
  const compare = LEADERBOARD_SORTS[sortKey] || LEADERBOARD_SORTS.badges;
  return Object.values(playersMap)
    .map(normalizePlayerRecord)
    .sort(compare)
    .slice(0, 10)
    .map(p => ({
      deviceId: p.deviceId,
      nickname: p.nickname,
      badgesCount: p.badgesCount,
      totalScore: p.totalScore,
      rollsCount: Number(p.rollsCount) || 0,
      bestRollPoints: Number(p.bestRollPoints) || 0,
      bestRollNumber: typeof p.bestRollNumber === 'number' ? p.bestRollNumber : null,
      bestRollSuperIds: Array.isArray(p.bestRollSuperIds) ? p.bestRollSuperIds : [],
      bestRollMultiplier: typeof p.bestRollMultiplier === 'number' ? p.bestRollMultiplier : 1,
      superCount: getSuperTimes(p),
      bestCombo: Number(p.bestCombo) || 0
    }));
}

function buildAllLeaderboards(playersMap) {
  const out = {};
  for (const key of Object.keys(LEADERBOARD_SORTS)) {
    out[key] = buildTop10(playersMap, key);
  }
  return out;
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
    const superUnlockers = (await kvGet(SUPER_UNLOCKERS_KEY)) || {};
    let latestSuperAnnouncement = (await kvGet(LATEST_SUPER_ANN_KEY)) || null;

    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
    if (
      latestSuperAnnouncement &&
      (latestSuperAnnouncement.updatedAt || latestSuperAnnouncement.ts) &&
      Date.now() - Number(latestSuperAnnouncement.updatedAt || latestSuperAnnouncement.ts) > TWENTY_FOUR_HOURS_MS
    ) {
      latestSuperAnnouncement = null;
      await kvSet(LATEST_SUPER_ANN_KEY, null);
    }

    // Rimuove annunci e liste di Super Badge che non esistono più (es. badge di prova)
    if (latestSuperAnnouncement && !SUPER_BADGE_MAP.has(latestSuperAnnouncement.badgeId)) {
      latestSuperAnnouncement = null;
      await kvSet(LATEST_SUPER_ANN_KEY, null);
    }
    let unlockersCleaned = false;
    for (const key of Object.keys(superUnlockers)) {
      if (!SUPER_BADGE_MAP.has(key)) {
        delete superUnlockers[key];
        unlockersCleaned = true;
      }
    }
    if (unlockersCleaned) {
      await kvSet(SUPER_UNLOCKERS_KEY, superUnlockers);
    }
    

    let dirty = false;
    for (const [id, p] of Object.entries(players)) {
      const normalized = normalizePlayerRecord(p);
      if (
        normalized.totalScore !== p.totalScore ||
        normalized.badgesCount !== p.badgesCount ||
        normalized.rollsCount !== p.rollsCount ||
        normalized.needsLegacyRecovery !== p.needsLegacyRecovery
      ) {
        players[id] = normalized;
        dirty = true;
      }
    }
    if (dirty) {
      await kvSet(PLAYERS_KEY, players);
    }

    if (req.method === 'GET') {
      return res.status(200).json({
        leaderboard: buildTop10(players),
          leaderboards: buildAllLeaderboards(players),
        kingMessage,
        superUnlockers,
        latestSuperAnnouncement
      });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (parseErr) {
          return res.status(400).json({ error: 'Payload JSON non valido.' });
        }
      }
      const { action, deviceId, nickname, message, secretId, unlockedIds, secretUnlockedIds, hardMode, speedrun, bestRollScore, combo } = body || {};

      if (!deviceId || typeof deviceId !== 'string') {
        return res.status(400).json({ error: 'Device ID non valido.' });
      }

      const existing = players[deviceId] ? normalizePlayerRecord(players[deviceId]) : null;

      // 1. ESTRAZIONE NUMERO LATO SERVER (anti-cheat + controllo Super Badge su recentRolls)
      if (action === 'roll') {
        if (!existing) {
          return res.status(404).json({ error: 'Dispositivo non registrato su questo server.' });
        }

        if (!existing.serverVerified && Array.isArray(unlockedIds)) {
          const validClientIds = sanitizeIdList(unlockedIds, BADGE_CATALOG);
          if (validClientIds.length <= (existing.badgesCount || 0) + 5) {
            existing.unlockedIds = Array.from(new Set([...existing.unlockedIds, ...validClientIds]));
          }
          const validClientSecrets = sanitizeIdList(secretUnlockedIds, VALID_SECRET_IDS);
          existing.secretUnlockedIds = Array.from(new Set([...existing.secretUnlockedIds, ...validClientSecrets]));
        }

        const result = Math.floor(Math.random() * TOTAL_NUMBERS) + MIN_NUM;

        // Aggiorna la coda degli ultimi 10 roll del giocatore lato server
        const updatedRecentRolls = [...(existing.recentRolls || []), result].slice(-10);

        const matched = [];
        for (const badge of BADGE_CATALOG.values()) {
          if (badge.check(result)) {
            matched.push(badge);
          }
        }

        const matchedSuper = [];
        for (const sBadge of SUPER_BADGES_CATALOG) {
          if (sBadge.check(updatedRecentRolls)) {
            matchedSuper.push(sBadge);
          }
        }

        const normalRollPoints = matched.reduce((sum, b) => sum + b.points, 0);
        const superRollPoints = matchedSuper.reduce((sum, sb) => sum + sb.points, 0);
        const basePoints = normalRollPoints + superRollPoints;
        let multiplier = 1;
        if (hardMode === true) multiplier *= HARD_MODE_MULTIPLIER;
        if (speedrun === true) multiplier *= SPEEDRUN_MULTIPLIER;
        // Ogni Super Badge della roll raddoppia il totale (i moltiplicatori si moltiplicano tra loro)
        multiplier *= Math.pow(SUPER_BADGE_ROLL_MULTIPLIER, matchedSuper.length);
        const rollPoints = Math.round(basePoints * multiplier);

        const prevUnlockedSet = new Set(existing.unlockedIds);
        const newlyUnlockedIds = [];

        for (const badge of matched) {
          if (!prevUnlockedSet.has(badge.id)) {
            prevUnlockedSet.add(badge.id);
            newlyUnlockedIds.push(badge.id);
          }
        }

        const prevSuperSet = new Set(existing.superUnlockedIds || []);
        const newlyUnlockedSuperIds = [];
        let superUnlockersDirty = false;

        for (const sb of matchedSuper) {
          if (!prevSuperSet.has(sb.id)) {
            prevSuperSet.add(sb.id);
            newlyUnlockedSuperIds.push(sb.id);
          }
          if (!Array.isArray(superUnlockers[sb.id])) {
            superUnlockers[sb.id] = [];
          }
          if (!superUnlockers[sb.id].includes(existing.nickname)) {
            superUnlockers[sb.id].push(existing.nickname);
            superUnlockersDirty = true;
          }
          latestSuperAnnouncement = {
            nickname: existing.nickname,
            badgeName: sb.name,
            badgeId: sb.id,
            updatedAt: Date.now()
          };
          superUnlockersDirty = true;
        }

        const updatedUnlockedIds = Array.from(prevUnlockedSet);
        const updatedSuperIds = Array.from(prevSuperSet);
        const updatedSecretIds = existing.secretUnlockedIds || [];
        const computedCountFromIds = updatedUnlockedIds.length + updatedSecretIds.length + updatedSuperIds.length;

        const newBadgesCount = existing.needsLegacyRecovery
          ? Math.max(existing.badgesCount || 0, computedCountFromIds)
          : computedCountFromIds;

        const newTotalScore = (Number(existing.totalScore) || 0) + rollPoints;
        const newRollsCount = (Number(existing.rollsCount) || 0) + 1;

        // Combo: il gioco dice a che combo sei, il server la accetta solo se le roll
        // sono davvero arrivate una dopo l'altra (al massimo 30 secondi tra una e l'altra)
        const nowMs = Date.now();
        const rollChain = (existing.lastRollAt && nowMs - Number(existing.lastRollAt) <= 30000)
          ? (Number(existing.rollChain) || 1) + 1
          : 1;
        const claimedCombo = Math.max(1, Math.floor(Number(combo)) || 1);
        const acceptedCombo = Math.min(claimedCombo, rollChain);

        players[deviceId] = {
          ...existing,
          lastRollAt: nowMs,
          rollChain,
          bestCombo: Math.max(Number(existing.bestCombo) || 0, acceptedCombo),
          unlockedIds: updatedUnlockedIds,
          secretUnlockedIds: updatedSecretIds,
          superUnlockedIds: updatedSuperIds,
          recentRolls: updatedRecentRolls,
          badgesCount: newBadgesCount,
          totalScore: newTotalScore,
          rollsCount: newRollsCount,
          ...pickBestRoll(existing, [
            { points: rollPoints, number: result, superIds: matchedSuper.map(sb => sb.id), multiplier: cleanMultiplier(multiplier) },
            claimFromBody(body)
          ]),
          superTimesCount: Math.max(getSuperTimes(existing), cleanSuperTimesClaim(body.superTimesClaim, existing.rollsCount)) + matchedSuper.length,
          serverVerified: true,
          needsLegacyRecovery: existing.needsLegacyRecovery || false,
          updatedAt: Date.now()
        };
        players[deviceId] = withReachedAt(existing, players[deviceId]);

        await kvSet(PLAYERS_KEY, players);
        if (superUnlockersDirty) {
          await kvSet(SUPER_UNLOCKERS_KEY, superUnlockers);
          await kvSet(LATEST_SUPER_ANN_KEY, latestSuperAnnouncement);
        }

        return res.status(200).json({
          result,
          rollPoints,
          basePoints,
          multiplier,
          newlyUnlockedIds,
          matchedSuperIds: matchedSuper.map(sb => sb.id),
          newlyUnlockedSuperIds,
          player: players[deviceId],
          leaderboard: buildTop10(players),
          leaderboards: buildAllLeaderboards(players),
          kingMessage,
          superUnlockers,
          latestSuperAnnouncement
        });
      }

      // 2. SBLOCCO BADGE SEGRETO VALIDATO LATO SERVER
      if (action === 'unlock_secret') {
        if (!existing) {
          return res.status(404).json({ error: 'Dispositivo non registrato.' });
        }
        if (!VALID_SECRET_IDS.has(secretId)) {
          return res.status(400).json({ error: 'Badge segreto non valido.' });
        }

        const secretSet = new Set(existing.secretUnlockedIds || []);
        let unlockedNow = false;
        if (!secretSet.has(secretId)) {
          secretSet.add(secretId);
          unlockedNow = true;
        }

        const updatedSecretIds = Array.from(secretSet);
        const updatedUnlockedIds = existing.unlockedIds || [];
        const updatedSuperIds = existing.superUnlockedIds || [];
        const useLegacyIncrement = !existing.serverVerified || existing.needsLegacyRecovery;

        players[deviceId] = {
          ...existing,
          unlockedIds: updatedUnlockedIds,
          secretUnlockedIds: updatedSecretIds,
          superUnlockedIds: updatedSuperIds,
          badgesCount: useLegacyIncrement
            ? (existing.badgesCount || 0) + (unlockedNow ? 1 : 0)
            : updatedUnlockedIds.length + updatedSecretIds.length + updatedSuperIds.length,
          totalScore: (Number(existing.totalScore) || 0) + (unlockedNow ? 67 : 0),
          updatedAt: Date.now()
        };
        players[deviceId] = withReachedAt(existing, players[deviceId]);

        await kvSet(PLAYERS_KEY, players);

        return res.status(200).json({
          unlockedNow,
          player: players[deviceId],
          leaderboard: buildTop10(players),
          leaderboards: buildAllLeaderboards(players),
          kingMessage,
          superUnlockers,
          latestSuperAnnouncement
        });
      }

      // 3. MESSAGGIO DEL #1 IN CLASSIFICA
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
          leaderboards: buildAllLeaderboards(players),
          kingMessage,
          superUnlockers,
          latestSuperAnnouncement
        });
      }

      // 4. REGISTRAZIONE
      if (action === 'register') {
        const cleanNick = String(nickname || '').trim();
        if (cleanNick.length < 2 || cleanNick.length > 20) {
          return res.status(400).json({ error: 'Il nickname deve avere tra 2 e 20 caratteri.' });
        }

        if (existing) {
          return res.status(200).json({
            player: existing,
            leaderboard: buildTop10(players),
          leaderboards: buildAllLeaderboards(players),
            kingMessage,
            superUnlockers,
            latestSuperAnnouncement
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
          unlockedIds: [],
          secretUnlockedIds: [],
          superUnlockedIds: [],
          recentRolls: [],
          badgesCount: 0,
          totalScore: 0,
          rollsCount: 0,
          serverVerified: true,
          updatedAt: Date.now()
        };

        await kvSet(PLAYERS_KEY, players);
        return res.status(201).json({
          player: players[deviceId],
          leaderboard: buildTop10(players),
          leaderboards: buildAllLeaderboards(players),
          kingMessage,
          superUnlockers,
          latestSuperAnnouncement
        });
      }

      // 5. CAMBIO NICKNAME
      if (action === 'rename') {
        if (!existing) {
          return res.status(404).json({ error: 'Profilo non trovato.' });
        }

        const cleanNick = String(nickname || '').trim();
        if (cleanNick.length < 2 || cleanNick.length > 20) {
          return res.status(400).json({ error: 'Il nickname deve avere tra 2 e 20 caratteri.' });
        }

        const nickTakenByOthers = Object.entries(players).some(
          ([id, p]) => id !== deviceId && p.nickname.toLowerCase() === cleanNick.toLowerCase()
        );
        if (nickTakenByOthers) {
          return res.status(409).json({ error: 'Questo nickname è già usato da un altro giocatore!' });
        }

        const oldNick = existing.nickname;
        players[deviceId] = {
          ...existing,
          nickname: cleanNick,
          updatedAt: Date.now()
        };

        // Aggiorna anche i nomi nella lista dei Super Badge sbloccati
        let superDirty = false;
        for (const badgeId of Object.keys(superUnlockers)) {
          if (Array.isArray(superUnlockers[badgeId])) {
            const idx = superUnlockers[badgeId].indexOf(oldNick);
            if (idx !== -1) {
              superUnlockers[badgeId][idx] = cleanNick;
              superDirty = true;
            }
          }
        }
        if (latestSuperAnnouncement && latestSuperAnnouncement.nickname === oldNick) {
          latestSuperAnnouncement = {
            ...latestSuperAnnouncement,
            nickname: cleanNick
          };
          superDirty = true;
        }
        if (superDirty) {
          await kvSet(SUPER_UNLOCKERS_KEY, superUnlockers);
          await kvSet(LATEST_SUPER_ANN_KEY, latestSuperAnnouncement);
        }

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
          leaderboards: buildAllLeaderboards(players),
          kingMessage,
          superUnlockers,
          latestSuperAnnouncement
        });
      }

      // 6. SYNC SOLA LETTURA / RIALLINEAMENTO SICURO
      if (action === 'sync') {
        if (!existing) {
          return res.status(404).json({ error: 'Dispositivo non registrato.' });
        }

        // Allinea la "roll con più aura" a quella che il giocatore vede nelle sue statistiche
        // Allinea miglior roll e super badge ottenuti con quello che il giocatore vede nel suo gioco
        const best = pickBestRoll(existing, [claimFromBody(body)]);
        const superTimes = Math.max(getSuperTimes(existing), cleanSuperTimesClaim(body.superTimesClaim, existing.rollsCount));
        const changed =
          best.bestRollPoints !== (Number(existing.bestRollPoints) || 0) ||
          best.bestRollNumber !== (typeof existing.bestRollNumber === 'number' ? existing.bestRollNumber : null) ||
          JSON.stringify(best.bestRollSuperIds) !== JSON.stringify(existing.bestRollSuperIds || []) ||
          best.bestRollMultiplier !== (typeof existing.bestRollMultiplier === 'number' ? existing.bestRollMultiplier : 1) ||
          superTimes !== getSuperTimes(existing);
        if (changed) {
          players[deviceId] = withReachedAt(existing, { ...existing, ...best, superTimesCount: superTimes });
          await kvSet(PLAYERS_KEY, players);
        }

        return res.status(200).json({
          player: players[deviceId] || existing,
          leaderboard: buildTop10(players),
          leaderboards: buildAllLeaderboards(players),
          kingMessage,
          superUnlockers,
          latestSuperAnnouncement
        });
      }

      return res.status(400).json({ error: `Azione non riconosciuta: ${String(action)}` });
    }

    return res.status(405).json({ error: 'Metodo non consentito.' });
  } catch (err) {
    console.error('Errore API leaderboard:', err);
    return res.status(500).json({ error: err.message || 'Errore interno del server.' });
  }
}
