const express = require('express');
const http = require('http');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const portName = '/dev/ttyS7'

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
   const [number1, number2] = data.split(',').map(Number);

   io.emit('updateNumbers', { number1, number2 });
 });

// Set up Socket.io connection
io.on('connection', (socket) => {
   console.log('A user connected');
  
  // You can add additional socket-related logic here if needed

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

