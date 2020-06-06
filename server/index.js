const express = require('express');
const path = require('path');
const multer = require('multer');

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
  res.send(text);
  res.end();
});

app.post('/uploadImg', upload.single('newImage'), (req, res) => {
  console.log(req.file);
  const name = req.file.originalname;
  res.send(name);
  res.end();
});

app.listen(port, () => console.log(`Listening on ${port}`));
