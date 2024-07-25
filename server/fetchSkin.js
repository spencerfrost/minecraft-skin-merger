const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const fetchSkin = async (req, res) => {
    const { name } = req.params;
    const url = `https://skins.danielraybone.com/v1/skin/${encodeURIComponent(name)}`;

    try {
        const response = await fetch(url);
        const data = await response.blob();  // Or response.buffer() if you're dealing with binary data

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');  // Adjust this as needed for security
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Content-Type', 'image/png');  // Set the correct content type

        // Send response
        data.arrayBuffer().then(buffer => {
            const imgBuffer = Buffer.from(buffer);
            res.send(imgBuffer);
        });

    } catch (error) {
        console.error('Failed to fetch skin:', error);
        res.status(500).json({ error: 'Failed to proxy request' });
    }
};

module.exports = fetchSkin;
