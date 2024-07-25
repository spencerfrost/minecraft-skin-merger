const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { PORT, isDev, DOMAIN, corsOptions } = require('./config');
const { mergeSkins } = require('./skinMerger');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.post('/api/merge-skins', upload.array('skins', 4), mergeSkins);

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'public', filename);
  res.download(filepath); // This will set headers to trigger download
});


if (!isDev) {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running in ${isDev ? 'development' : 'production'} mode on port ${PORT}`);
});
