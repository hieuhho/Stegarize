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

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('use .png only'), false);
  }
};

const upload = multer({ storage, fileFilter }).single('secretImage');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

let text;
let fileName;

app.post('/uploadText', (req, res) => {
  text = req.body.text;
  res.status(201).end();
});

app.post('/uploadImg', (req, res) => {
  upload(req, res, (err) => {
    console.log('req: ', req);
    if (err) {
      res.status(400).send('use .png only');
    } else {
      fileName = req.file.originalname;
      const original = fs.readFileSync(req.file.path);
      const concealed = steggy.conceal(original, text, 'utf-8');
      fs.writeFileSync(`./encoded/${fileName}`, concealed);
      res.status(201).end();
    }
  });
});

app.get('/download', (req, res) => {
  res.download(`./encoded/${fileName}`, fileName);
});

app.post('/decode', upload, (req, res) => {
  const encoded = req.file.path;
  const secretImage = fs.readFileSync(encoded);
  const revealed = steggy.reveal(secretImage, 'utf-8');
  res.send(revealed);
});

app.listen(port, () => console.log(`Listening on ${port}`));
