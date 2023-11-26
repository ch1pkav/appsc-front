// public/main.js
const leftNumberElement = document.getElementById('leftNumber');
const rightNumberElement = document.getElementById('rightNumber');

const serialport = require('serialport');
const Readline = require('@serialport/parser-readline');

const port = new serialport('COM4', { baudRate: 9600 }); // Change COM3 to your port

const parser = port.pipe(new Readline({ delimiter: '\n' }));

parser.on('data', (data) => {
  const [left, right] = data.split(',');

  leftNumberElement.textContent = left;
  rightNumberElement.textContent = right;
});

