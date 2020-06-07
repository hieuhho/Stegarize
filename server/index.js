const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const steggy = require('steggy-noencrypt');

const app = express();
const port = process.env.PORT || 4000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

let text;
let fileName;

app.post('/uploadText', (req, res) => {
  text = req.body.text;
  res.status(201).end();
});

app.post('/uploadImg', upload.single('newImage'), (req, res) => {
  fileName = req.file.originalname;
  const original = fs.readFileSync(req.file.path);
  const concealed = steggy.conceal(original, text, 'utf-8');
  fs.writeFileSync(`./encoded/${fileName}`, concealed);
  res.status(201).end();
});

app.get('/download', (req, res) => {
  res.download(`./encoded/${fileName}`, fileName);
});

app.post('/decode', upload.single('decodeImage'), (req, res) => {
  const encoded = req.file.path;
  const secretImage = fs.readFileSync(encoded);
  const revealed = steggy.reveal(secretImage, 'utf-8');
  res.send(revealed);
});

app.listen(port, () => console.log(`Listening on ${port}`));
