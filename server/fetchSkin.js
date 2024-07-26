const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const fetchSkin = async (req, res) => {
    const { name } = req.params;
    const url = `https://skins.danielraybone.com/v1/skin/${encodeURIComponent(name)}`;

    console.log(`Fetching skin for: ${name}`);
    console.log(`URL: ${url}`);

    try {
        const response = await fetch(url);
        console.log(`Response status: ${response.status}`);
        console.log(`Response headers:`, response.headers.raw());

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        console.log(`Content-Type: ${contentType}`);

        if (!contentType || !contentType.includes('image/png')) {
            console.warn(`Unexpected content type: ${contentType}`);
        }

        const data = await response.arrayBuffer();
        console.log(`Received data size: ${data.byteLength} bytes`);

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');  // Adjust this as needed for security
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Content-Type', 'image/png');

        // Send response
        const imgBuffer = Buffer.from(data);
        console.log(`Sending response with size: ${imgBuffer.length} bytes`);
        res.send(imgBuffer);

    } catch (error) {
        console.error('Failed to fetch skin:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Failed to proxy request', message: error.message });
    }
};

module.exports = fetchSkin;