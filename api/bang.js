export default async function handler(req, res) {
	// Set CORS headers to allow your domain
	res.setHeader('Access-Control-Allow-Origin', 'https://search.phadonia.com');
	res.setHeader('Access-Control-Allow-Methods', 'GET');

	// Set cache headers (1 week)
	res.setHeader('Cache-Control', 'public, max-age=604800, s-maxage=604800');

	try {
		// Fetch bangs from DuckDuckGo
		const response = await fetch('https://duckduckgo.com/bang.js');

		if (!response.ok) {
			throw new Error(`DuckDuckGo responded with ${response.status}`);
		}

		// Parse and forward the response
		const data = await response.json();
		res.status(200).json(data);
	} catch (error) {
		console.error('Error fetching bangs:', error);
		res.status(500).json({ error: 'Failed to fetch bangs' });
	}
}