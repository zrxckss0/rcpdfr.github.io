export default {
  async fetch(request) {
    const url = new URL(request.url);
    const placeId = url.searchParams.get('placeId');

    if (!placeId) {
      return json({ error: 'Missing placeId query parameter.' }, 400);
    }

    try {
      const placeRes = await fetch(
        `https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`,
      );
      if (!placeRes.ok) {
        return json({ error: 'Failed to resolve universeId.' }, 502);
      }

      const placeData = await placeRes.json();
      const universeId = placeData?.[0]?.universeId;
      if (!universeId) {
        return json({ error: 'No universeId found for placeId.' }, 404);
      }

      const statsRes = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
      if (!statsRes.ok) {
        return json({ error: 'Failed to fetch game stats.' }, 502);
      }

      const statsData = await statsRes.json();
      const game = statsData?.data?.[0];
      if (!game) {
        return json({ error: 'Game stats not found.' }, 404);
      }

      return json(
        {
          playing: game.playing ?? 0,
          visits: game.visits ?? 0,
          favoritedCount: game.favoritedCount ?? 0,
          universeId,
          placeId: Number(placeId),
        },
        200,
      );
    } catch {
      return json({ error: 'Unexpected proxy error.' }, 500);
    }
  },
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}
