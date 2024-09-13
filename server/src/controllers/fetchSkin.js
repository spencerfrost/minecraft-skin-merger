import fetch from 'node-fetch';

export default async function fetchSkin(req, res) {
    const { name } = req.params;
    const url = `https://skins.danielraybone.com/v1/skin/${encodeURIComponent(name)}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        const data = await response.arrayBuffer();

        if (!contentType?.includes('image/png')) {
            console.warn(`Unexpected content type: ${contentType}`);
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Content-Type', 'image/png');

        const imgBuffer = Buffer.from(data);
        res.send(imgBuffer);
    } catch (error) {
        console.error('Failed to fetch skin:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Failed to proxy request', message: error.message });
    }
};
