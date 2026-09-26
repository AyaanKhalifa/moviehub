import { SERIES_SEASONS_DATA } from './seriesData.js';

// Verified YouTube Trailer Video IDs (Status 200 validated) for movies, sequels, and series
export const TRAILER_MAP = {
  // Movie Franchises & Distinct Sequels
  'dune: part two': 'Way9Dexny3w',
  'dune': 'n9xhJrPXop4',
  'deadpool & wolverine': '73_1biulkYk',
  'deadpool': '9vN6DHB6bJc',
  'avatar: the way of water': 'd9MyW72ELq0',
  'avatar': '5PSNL1qE6VY',
  'the dark knight rises': 'GokKUqLcvD8',
  'the dark knight': 'EXeTwQWrcwY',
  'batman begins': 'neY2xVmOfUM',
  'the batman': 'mqqft2x_Aa4',
  'spider-man: across the spider-verse': 'cqGjhVJWtEg',
  'spider-man: into the spider-verse': 'tg52up16eq0',
  'spider-man: no way home': 'JfVOs4VSpmA',
  'avengers: endgame': 'TcMBFSGVi1c',
  'avengers: infinity war': '6ZfuNTqbHE8',
  'the avengers': 'eOrNdBpGMv8',
  'top gun: maverick': 'giXco2jaZ_4',
  'top gun': 'xa_z57UatDY',
  'gladiator ii': '4rgYUipGJNo',
  'gladiator': 'owK1qxDselE',
  'iron man 3': 'Ke1Y3P9D0Bc',
  'iron man 2': 'BoohRoVA9WQ',
  'iron man': '8ugaeA-nMTc',
  'john wick: chapter 4': 'qEVUtrk8_B4',
  'john wick: chapter 3 - parabellum': 'M7XM597XO94',
  'john wick': '2AUmvWm5ZDQ',
  'guardians of the galaxy vol. 3': 'u3V5KDHRQvk',
  'guardians of the galaxy': 'd96cjJhvlMA',
  'black panther: wakanda forever': '_Z3QKkl1WyM',
  'black panther': 'xjDjIWPwcPU',
  'the matrix resurrections': '9ix7TUGVYIo',
  'the matrix': 'vKQi3bBA1y8',

  // Iconic Standalone Movies
  'oppenheimer': 'uYPbbksJxIg',
  'interstellar': 'zSWdZVtXT7E',
  'inception': 'YoHD9XEInc0',
  'pulp fiction': 's7EdQ4FqbhY',
  'fight club': 'SUXWAEX2jlg',
  'the lord of the rings: the return of the king': 'r5X-hFf6Bwo',
  'the lord of the rings: the two towers': 'LbfMDwc4azU',
  'the lord of the rings: the fellowship of the ring': 'V75dMMIW2B4',
  'joker: folie a deux': '_OKAwz2MsJs',
  'joker': 'zAGVQLHvwOY',

  // TV & Web Series Main Trailers
  'breaking bad': 'HhesaQXLuRY',
  'stranger things': 'b9EkMc79ZSU',
  'game of thrones': 'KPLWWIOCOOQ',
  'the last of us': 'uLtkt8BonwM',
  'the boys': 'MN8fFM1ZdWo',
  'chernobyl': 's9APLXM9Ei8',
  'better call saul': '9q4qzYrHVmI',
  'house of the dragon': 'DotnJ7tTA34',
  'peaky blinders': 'oVzVdvGIC7U',
  'severance': 'xEQP4VVuyrY',
  'the witcher': 'ndl1W4ltcmg',
  'the walking dead': 'sfAc2U20uyg',
  'loki': 'nW948Va-l10',
  'dark': 'rrwycJ08PSA',
  'money heist': 'hMANIarjT50',
  'squid game': 'oqxAJKy0ii4',

  // Anime
  'attack on titan': 'MGRm4IzK1SQ',
  'demon slayer: kimetsu no yaiba': 'VQGCKyvzIM4',
  'demon slayer': 'VQGCKyvzIM4',
  'death note': 'NlJZ-YgAt-c',
  'jujutsu kaisen': 'pkKu9hLT-t8',
  'spirited away': 'ByXuk9QqQkk',
  'one piece': 'Ades3pQbeh8',
  'fullmetal alchemist: brotherhood': '--IcmZkvL0Q',
  'fullmetal alchemist': '--IcmZkvL0Q',
  'your name.': 'xU47nhruN-Q',
  'your name': 'xU47nhruN-Q',
  'chainsaw man': 'v4yLeNt-kCU',
  'tokyo ghoul': '7aMOurgDB-o',
  'bleach': 'e8YBesRKq_U',
  'cyberpunk: edgerunners': 'JtqIas3bYhg',
  'arcane': 'fXmAurh012s'
};

/**
 * Returns a verified YouTube video ID for a movie or TV series title.
 * Accurately prevents returning "first part" trailer for sequels or later seasons.
 */
export const getTrailerVideoId = (title, seasonNum = null) => {
  if (!title) return null;
  const clean = title.toLowerCase().trim();

  // 1. If explicit season requested OR title contains "Season X" / "S X"
  const seasonMatch = clean.match(/\b(?:season|s)\s*(\d+)\b/i);
  const targetSeason = seasonNum || (seasonMatch ? parseInt(seasonMatch[1], 10) : null);

  if (targetSeason) {
    const baseTitle = clean
      .replace(/\b(?:season|s)\s*\d+\b/gi, '')
      .replace(/\b(?:episode|ep)\s*\d+\b/gi, '')
      .trim();

    // Search verified season trailers in SERIES_SEASONS_DATA
    const matchedSeriesKey = Object.keys(SERIES_SEASONS_DATA).find(
      (k) => baseTitle.includes(k) || k.includes(baseTitle)
    );

    if (matchedSeriesKey && SERIES_SEASONS_DATA[matchedSeriesKey][targetSeason]) {
      const seasonData = SERIES_SEASONS_DATA[matchedSeriesKey][targetSeason];
      if (seasonData.trailerId) {
        return seasonData.trailerId;
      }
    }

    // IMPORTANT: If user wants Season 2+, NEVER return Season 1 trailer or Dune trailer!
    // Return null so the UI can gracefully direct user to YouTube search for that exact season
    return null;
  }

  // 2. Exact match in TRAILER_MAP
  if (TRAILER_MAP[clean]) {
    return TRAILER_MAP[clean];
  }

  // 3. Sequels & Parts handling (Preventing sequel from matching Part 1)
  const sequelRegex = /\b(part|chapter|vol|volume|ii|iii|iv|v|vi|2|3|4|5|rises|way of water|folie|resurrections|reloaded)\b/i;
  const queryHasSequel = sequelRegex.test(clean);

  // Sort keys by descending length so specific titles (e.g. "Deadpool 2") match before "Deadpool"
  const sortedKeys = Object.keys(TRAILER_MAP).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const keyHasSequel = sequelRegex.test(key);

    // If query is for a sequel, DO NOT match a key that is NOT for that sequel!
    if (queryHasSequel && !keyHasSequel) continue;

    // If key is for a sequel, DO NOT match a query that is NOT for that sequel!
    if (!queryHasSequel && keyHasSequel) continue;

    if (clean.includes(key) || key.includes(clean)) {
      return TRAILER_MAP[key];
    }
  }

  // Return null when not found — NEVER play an unrelated or wrong first part video!
  return null;
};
