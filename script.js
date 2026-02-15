const universeId = 509649295;

const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
};

const formatNum = (num) => new Intl.NumberFormat('en-US').format(num || 0);

const loadGameStats = async () => {
  try {
    const response = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
    if (!response.ok) throw new Error('Stats request failed');

    const { data } = await response.json();
    const game = data?.[0];
    if (!game) throw new Error('Game not found');

    setText('live-players', formatNum(game.playing));
    setText('visits', formatNum(game.visits));
    setText('favorites', formatNum(game.favoritedCount));
  } catch {
    setText('live-players', 'Unavailable');
    setText('visits', 'Unavailable');
    setText('favorites', 'Unavailable');
  }
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
