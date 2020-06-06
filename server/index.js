const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const upload = multer({ dest: 'uploads/' });
const port = 4000;

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.get('/lol', (req, res) => {
  res.end('my dude');
});

app.post('/uploadImg', upload.single('newImage'), (req, res) => {
  console.log(req.file);
  res.end('is ok');
});

app.listen(port, () => console.log(`Listening on ${port}`));
