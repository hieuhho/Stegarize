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
let newName;
let originalName;

const deleteFiles = (uploadName, encodedName) => {
  if (uploadName) {
    fs.unlinkSync(`./uploads/${uploadName}`, (err) => {
      if (err) console.log(`Deletion Error: ${err}`);
    });
  }
  if (encodedName) {
    fs.unlinkSync(`./encoded/${encodedName}`, (err) => {
      if (err) console.log(`Deletion Error: ${err}`);
    });
  }
};

app.post('/uploadText', (req, res) => {
  text = req.body.text;
  res.status(201).end();
});

app.post('/uploadImg', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(406).send('use .png only');
    } else {
      newName = req.file.filename;
      originalName = req.file.originalname;
      const original = fs.readFileSync(req.file.path);
      const concealed = steggy.conceal(original, text, 'utf-8');
      fs.writeFileSync(`./encoded/${originalName}`, concealed);
      res.status(201).end();
    }
  });
});

app.get('/download', (req, res) => {
  res.download(`./encoded/${originalName}`, originalName);
  setTimeout(() => { deleteFiles(newName, originalName); }, 5000);
});

app.post('/decode', upload, (req, res) => {
  newName = req.file.filename;
  const encoded = req.file.path;
  const secretImage = fs.readFileSync(encoded);
  setTimeout(() => { deleteFiles(newName); }, 5000);
  const revealed = steggy.reveal(secretImage, 'utf-8');
  res.send(revealed);
});

app.listen(port, () => console.log(`Listening on ${port}`));
