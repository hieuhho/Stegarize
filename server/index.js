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

app.post('/uploadText', (req, res) => {
  text = req.body.text;
  res.status(201).end();
});

app.post('/uploadImg', upload.single('newImage'), (req, res) => {
  console.log(req.file);
  const name = req.file.originalname;
  const original = fs.readFileSync(req.file.path);
  const message = text;
  const concealed = steggy.conceal(original, message, 'utf-8');
  fs.writeFileSync(`./encoded/${req.file.originalname}`, concealed);
  res.write(name);
  res.end();
});


app.listen(port, () => console.log(`Listening on ${port}`));
