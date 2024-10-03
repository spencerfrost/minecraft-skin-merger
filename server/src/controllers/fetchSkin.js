import fetch from 'node-fetch';
import sanitizeHtml from 'sanitize-html';
import validator from 'validator';

export default async function fetchSkin(req, res) {
    const { name } = req.params;

    // Input validation
    if (!name || !validator.isAlphanumeric(name) || name.length > 36) {
        return res.status(400).json({ error: 'Invalid username or UUID' });
    }

    const url = `https://skins.danielraybone.com/v1/skin/${encodeURIComponent(name)}`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'MinecraftSkinMerger/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');

        // Validate content type
        if (!contentType || !contentType.includes('image/')) {
            throw new Error('Invalid content type received');
        }

        const data = await response.arrayBuffer();

        // Set secure headers
        res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'");
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Type', contentType);

        const imgBuffer = Buffer.from(data);
        res.send(imgBuffer);
    } catch (error) {
        console.error('Failed to fetch skin:', error);
        res.status(500).json({ error: sanitizeHtml('Failed to fetch skin') });
    }
}