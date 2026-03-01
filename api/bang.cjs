const { getCache } = require('@vercel/functions');

const CACHE_MAX_AGE = 7 * 24 * 60 * 60; // 1 week in seconds
const CACHE_KEY = 'duckduckgo-bangs';

module.exports = async (req, res) => {
	const cache = getCache();
	const cached = await cache.get(CACHE_KEY);
	if (cached) {
		res.setHeader('Cache-Control', `max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}`);
		res.status(200).json(cached);
		return;
	}

	const response = await fetch('https://duckduckgo.com/bang.js');

	if (!response.ok) {
		res.status(response.status).json({ error: 'Failed to fetch bangs' });
		return;
	}

	const data = await response.json();
	data.unshift({
		c: '',
		d: '',
		r: 0,
		s: '',
		sc: '',
		t: 'g',
		u: 'https://www.google.com/search?udm=14&q={{{s}}}'
	});
	data.unshift({
		c: '',
		d: '',
		r: 0,
		s: '',
		sc: '',
		t: 'kagi',
		u: 'https://kagi.com/search?q={{{s}}}'
	});

	await cache.set(CACHE_KEY, data, { ttl: CACHE_MAX_AGE });

	res.setHeader('Cache-Control', `max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}`);
	res.status(200).json(data);
};