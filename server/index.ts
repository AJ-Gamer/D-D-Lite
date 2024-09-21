const express = require('express');
const path = require('path');
const PORT = 3000;
const DIST_DIR = path.resolve(__dirname, '../dist/client');
const app = express();

app.use(express.json());
app.use(express.static(DIST_DIR));

app.get('/', (req: object, res: { sendFile: (arg0: any) => void; }) => {
  res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.info(`Server listening at http://127.0.0.1:${PORT}`);
});