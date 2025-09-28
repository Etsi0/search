module.exports = async (req, res) => {
	const response = await fetch('https://duckduckgo.com/bang.js', {
		next: {
			revalidate: 7 * 24 * 60 * 60, // 1 week
		},
	});

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
		t: 'kagi',
		u: 'https://kagi.com/search?q={{{s}}}'
	});

	res.status(200).json(data);
};