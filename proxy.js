const express = require('express');
const cors = require('cors');
const request = require('request');

const app = express();
app.use(cors());

app.get('/proxy', (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('Missing url parameter');
    }
    // Set header để trình duyệt nhận diện là file mp3
    res.setHeader('Content-Type', 'audio/mpeg');
    // Stream file từ url gốc về client
    request
        .get(url)
        .on('error', (err) => {
            res.status(500).send('Error fetching file: ' + err.message);
        })
        .pipe(res);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy server listening at http://localhost:${PORT}`);
});
