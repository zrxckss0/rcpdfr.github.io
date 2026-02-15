const placeId = 1486528523;
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

const loadGameMedia = async () => {
  const gallery = document.getElementById('gallery-grid');
  if (!gallery) return;

  try {
    const mediaResponse = await fetch(`https://develop.roblox.com/v1/universes/${universeId}/places/${placeId}/media`);
    if (!mediaResponse.ok) throw new Error('Media request failed');

    const mediaData = await mediaResponse.json();
    const images = (mediaData.data || [])
      .filter((item) => item.imageId)
      .slice(0, 6);

    if (!images.length) throw new Error('No media returned');

    gallery.innerHTML = '';

    images.forEach((item) => {
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = 'RCPDFR gameplay image';
      img.src = `https://tr.rbxcdn.com/${item.imageId}/768/432/Image/Webp`;
      gallery.appendChild(img);
    });
  } catch {
    gallery.innerHTML = `
      <img src="https://tr.rbxcdn.com/180DAY-cfef647db3e2f8d3899c97b3f80382bd/768/432/Image/Webp/noFilter" alt="RCPDFR showcase" />
      <img src="https://tr.rbxcdn.com/180DAY-ddf15a2017d3e6ac985f5d8fb4cf294f/768/432/Image/Webp/noFilter" alt="RCPDFR patrol showcase" />
      <img src="https://tr.rbxcdn.com/180DAY-1820df6fb8f4974b0c9c38f2f4be4f77/768/432/Image/Webp/noFilter" alt="RCPDFR response showcase" />
    `;
  }
};

loadGameStats();
loadGameMedia();
