const placeId = 1486528523;

const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
};

const formatNum = (num) => new Intl.NumberFormat('en-US').format(num || 0);

const fetchJson = async (url) => {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
};

const resolveUniverseId = async () => {
  const resolvers = [
    `https://apis.roproxy.com/games/v1/games/multiget-place-details?placeIds=${placeId}`,
    `https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`,
  ];

  for (const url of resolvers) {
    try {
      const data = await fetchJson(url);
      const universeId = data?.[0]?.universeId;
      if (universeId) return universeId;
    } catch {
      // Try next resolver.
    }
  }

  return null;
};

const loadGameStats = async () => {
  const universeId = await resolveUniverseId();
  if (!universeId) {
    setText('live-players', 'Unavailable');
    setText('visits', 'Unavailable');
    setText('favorites', 'Unavailable');
    return;
  }

  const statSources = [
    `https://apis.roproxy.com/games/v1/games?universeIds=${universeId}`,
    `https://games.roblox.com/v1/games?universeIds=${universeId}`,
  ];

  for (const url of statSources) {
    try {
      const payload = await fetchJson(url);
      const game = payload?.data?.[0];
      if (!game) continue;

      setText('live-players', formatNum(game.playing));
      setText('visits', formatNum(game.visits));
      setText('favorites', formatNum(game.favoritedCount));
      return;
    } catch {
      // Try next endpoint.
    }
  }

  setText('live-players', 'Unavailable');
  setText('visits', 'Unavailable');
  setText('favorites', 'Unavailable');
};

const enableRevealAnimations = () => {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    },
  );

  elements.forEach((el) => observer.observe(el));
};

loadGameStats();
enableRevealAnimations();
