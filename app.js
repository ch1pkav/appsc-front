const express = require('express');
const http = require('http');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const noDeviceStr = 'No device connected';
const zeroScore = '0';

var portName = '/dev/ttyUSB0'
var portFound = true;

// Exception handler
process.on('uncaughtException', function (err) {
  console.log(err);
  console.log("Node NOT Exiting...");
  portFound = false;
  io.emit('updateNumbers', { zeroScore, zeroScore, noDeviceStr });
});

var serialPort = new SerialPort({ path: portName, baudRate: 115200 });
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Set up a route for the web page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Listen for incoming serial data
parser.on('data', (data) => {
  const [number1, number2, state] = data.split(',');

  io.emit('updateNumbers', { number1, number2, state });
});

// Set up Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');
  if (!portFound) {
    // Send a message to the client to prompt for portName
    socket.emit('requestPortName');
  }

  // Handle user input for portName
  socket.on('submitPortName', (newPortName) => {
    portName = newPortName;
    serialPort = new SerialPort({ path: portName, baudRate: 115200 });
    portFound = true;
    io.emit('updateNumbers', { zeroScore, zeroScore, noDeviceStr });
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

