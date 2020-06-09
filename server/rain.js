const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVXYZあいうえおかきくけこがぎぐげごさしすせそざじずぜぞたちつてとだぢづでどなにぬねのはひふへほばびぶべぼぱぴぷぺぽまみむめもやゆよらりるれろわをんABCDEFGHIJKLMNOPQRSTUVXYZ';
alphabet = alphabet.split('');

const fontSize = 10;
const columns = canvas.width / fontSize;

const rain = [];
for (let i = 0; i < columns; i += 1) {
  rain[i] = 1;
}

function matrixRain() {
  ctx.fillStyle = 'rgba(0, 0, 0, .1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < rain.length; i += 1) {
    const text = alphabet[Math.floor(Math.random() * alphabet.length)];
    ctx.fillStyle = 'green';
    ctx.fillText(text, i * fontSize, rain[i] * fontSize);
    rain[i] += 1;
    if (rain[i] * fontSize > canvas.height && Math.random() > 0.95) {
      rain[i] = 0;
    }
  }
}

setInterval(matrixRain, 35);
