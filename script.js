const placeId = 1486528523;

// Replace this with your deployed proxy endpoint (Cloudflare Worker/Vercel/Netlify Function).
const proxyBaseUrl = window.RCPDFR_PROXY_URL || 'https://your-proxy-domain.example/api/roblox-stats';

const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
};

const formatNum = (num) => new Intl.NumberFormat('en-US').format(num || 0);

const loadGameStats = async () => {
  try {
    const response = await fetch(`${proxyBaseUrl}?placeId=${placeId}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Stats request failed');

    const data = await response.json();

    setText('live-players', formatNum(data.playing));
    setText('visits', formatNum(data.visits));
    setText('favorites', formatNum(data.favoritedCount));
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
