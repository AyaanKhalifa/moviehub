// Complete Entertainment Taxonomy with verified search queries for IMDb/OMDb
export const ENTERTAINMENT_CATEGORIES = [
  {
    id: 'movies-film',
    title: 'Movies & Film',
    icon: '🎬',
    color: '#f5c518',
    subtypes: [
      { name: 'Movie', query: 'Inception', type: 'movie' },
      { name: 'Feature Film', query: 'Interstellar', type: 'movie' },
      { name: 'Short Film', query: 'Piper', type: 'movie' },
      { name: 'Documentary', query: 'Free Solo', type: 'movie' },
      { name: 'Documentary Short', query: 'Period. End of Sentence', type: 'movie' },
      { name: 'TV Movie', query: 'Duel', type: 'movie' },
      { name: 'Compilation Film', query: 'Fantasia', type: 'movie' },
      { name: 'Anthology Film', query: 'Sin City', type: 'movie' },
      { name: 'Concert Film', query: 'Stop Making Sense', type: 'movie' },
      { name: 'Animated Film', query: 'Spider-Man: Into the Spider-Verse', type: 'movie' },
      { name: 'Anime Film', query: 'Spirited Away', type: 'movie' },
      { name: 'Student Film', query: 'Electronic Labyrinth', type: 'movie' },
      { name: 'Fan Film', query: 'Batman: Dead End', type: 'movie' }
    ]
  },
  {
    id: 'television',
    title: 'Television',
    icon: '📺',
    color: '#8b5cf6',
    subtypes: [
      { name: 'TV Series', query: 'Breaking Bad', type: 'series' },
      { name: 'Limited Series / Miniseries', query: 'Chernobyl', type: 'series' },
      { name: 'TV Episode', query: 'Ozymandias', type: 'episode' },
      { name: 'TV Special', query: 'Sherlock: The Abominable Bride', type: 'movie' },
      { name: 'TV Short', query: 'Toy Story That Time Forgot', type: 'movie' },
      { name: 'TV Movie', query: 'Black Mirror: Bandersnatch', type: 'movie' },
      { name: 'Anthology Series', query: 'Fargo', type: 'series' },
      { name: 'Variety Show', query: 'Saturday Night Live', type: 'series' },
      { name: 'Talk Show', query: 'The Tonight Show', type: 'series' },
      { name: 'Game Show', query: 'Jeopardy', type: 'series' },
      { name: 'Reality Show', query: 'Survivor', type: 'series' },
      { name: 'News Program', query: '60 Minutes', type: 'series' },
      { name: 'Sports Program', query: 'Formula 1: Drive to Survive', type: 'series' }
    ]
  },
  {
    id: 'streaming-web',
    title: 'Streaming / Web',
    icon: '🌐',
    color: '#06b6d4',
    subtypes: [
      { name: 'Web Series', query: 'Stranger Things', type: 'series' },
      { name: 'Web Episode', query: 'Cobra Kai', type: 'series' },
      { name: 'Streaming Series', query: 'The Mandalorian', type: 'series' },
      { name: 'Streaming Special', query: 'The Guardians of the Galaxy Holiday Special', type: 'movie' },
      { name: 'Streaming Movie', query: 'The Irishman', type: 'movie' },
      { name: 'Online Short', query: 'Kung Fury', type: 'movie' },
      { name: 'Digital Series', query: 'The Boys', type: 'series' }
    ]
  },
  {
    id: 'animation',
    title: 'Animation',
    icon: '🍥',
    color: '#f43f5e',
    subtypes: [
      { name: 'Anime', query: 'Attack on Titan', type: 'series' },
      { name: 'Anime Series', query: 'Demon Slayer', type: 'series' },
      { name: 'Anime Movie', query: 'Your Name.', type: 'movie' },
      { name: 'Anime OVA', query: 'Hellsing Ultimate', type: 'series' },
      { name: 'Anime ONA', query: 'Cyberpunk: Edgerunners', type: 'series' },
      { name: 'Cartoon', query: 'Avatar: The Last Airbender', type: 'series' },
      { name: 'Animated Series', query: 'Arcane', type: 'series' },
      { name: 'Animated Short', query: 'Feast', type: 'movie' },
      { name: 'Animated Special', query: 'How to Train Your Dragon: Homecoming', type: 'movie' },
      { name: 'CGI Series', query: 'Star Wars: The Clone Wars', type: 'series' },
      { name: 'CGI Film', query: 'Toy Story 4', type: 'movie' },
      { name: 'Stop-Motion', query: 'Guillermo del Toro\'s Pinocchio', type: 'movie' },
      { name: 'Clay Animation', query: 'Wallace and Gromit', type: 'movie' }
    ]
  },
  {
    id: 'music',
    title: 'Music',
    icon: '🎵',
    color: '#ec4899',
    subtypes: [
      { name: 'Music Video', query: 'Thriller', type: 'movie' },
      { name: 'Music Special', query: 'Adele Live in New York City', type: 'movie' },
      { name: 'Concert', query: 'Taylor Swift: The Eras Tour', type: 'movie' },
      { name: 'Live Performance', query: 'Queen: Live at Wembley Stadium', type: 'movie' },
      { name: 'Musical', query: 'Hamilton', type: 'movie' },
      { name: 'Music Documentary', query: 'Get Back', type: 'series' },
      { name: 'Album-related Film', query: 'Beyoncé: Lemonade', type: 'movie' },
      { name: 'Concert Documentary', query: 'Homecoming: A Film by Beyoncé', type: 'movie' }
    ]
  },
  {
    id: 'interactive',
    title: 'Interactive',
    icon: '🎮',
    color: '#10b981',
    subtypes: [
      { name: 'Video Game', query: 'The Last of Us Part I', type: 'game' },
      { name: 'Mobile Game', query: 'Genshin Impact', type: 'game' },
      { name: 'PC Game', query: 'Cyberpunk 2077', type: 'game' },
      { name: 'Console Game', query: 'God of War Ragnarök', type: 'game' },
      { name: 'Interactive Movie', query: 'Black Mirror: Bandersnatch', type: 'movie' },
      { name: 'Interactive Special', query: 'Unbreakable Kimmy Schmidt: Kimmy vs the Reverend', type: 'movie' }
    ]
  },
  {
    id: 'other-entertainment',
    title: 'Other Entertainment',
    icon: '🎤',
    color: '#eab308',
    subtypes: [
      { name: 'Podcast', query: 'The Joe Rogan Experience', type: 'series' },
      { name: 'Podcast Series', query: 'Serial', type: 'series' },
      { name: 'Podcast Episode', query: 'Huberman Lab', type: 'series' },
      { name: 'Radio Program', query: 'The War of the Worlds', type: 'movie' },
      { name: 'Stage Play', query: 'Fleabag', type: 'movie' },
      { name: 'Theatre Production', query: 'National Theatre Live: Frankenstein', type: 'movie' },
      { name: 'Stand-Up Special', query: 'Dave Chappelle: Sticks & Stones', type: 'movie' },
      { name: 'Stand-Up Performance', query: 'Ricky Gervais: Humanity', type: 'movie' },
      { name: 'Award Show', query: 'The Oscars', type: 'series' },
      { name: 'Festival Program', query: 'Sundance Film Festival', type: 'series' },
      { name: 'Sports Event', query: 'Super Bowl', type: 'series' },
      { name: 'E-Sports Event', query: 'League of Legends World Championship', type: 'series' }
    ]
  },
  {
    id: 'non-fiction',
    title: 'Non-fiction',
    icon: '📚',
    color: '#3b82f6',
    subtypes: [
      { name: 'Documentary', query: 'Planet Earth II', type: 'series' },
      { name: 'Documentary Series', query: 'The Last Dance', type: 'series' },
      { name: 'Documentary Episode', query: 'Our Planet', type: 'series' },
      { name: 'Biography', query: 'A Beautiful Mind', type: 'movie' },
      { name: 'Historical Program', query: 'The World at War', type: 'series' },
      { name: 'Nature Program', query: 'Blue Planet II', type: 'series' },
      { name: 'Travel Program', query: 'Anthony Bourdain: Parts Unknown', type: 'series' },
      { name: 'Science Program', query: 'Cosmos: A Spacetime Odyssey', type: 'series' },
      { name: 'Educational Program', query: 'MythBusters', type: 'series' }
    ]
  }
];
