const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { performance } = require('perf_hooks');

const PORT = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",  // Allow the admin panel's origin
    methods: ["GET", "POST"]
  }
});

let buzzerData = [];  // Array to store buzzer data with team name and timestamp

// Serve static files
app.use(express.static('public'));

// Listen for socket connections
io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Handle buzzer pressed event
  socket.on('buzzerPressed', (data) => {
    console.log(`Buzzer Pressed by ${data.teamName}`);
    const timestamp = performance.now();
    const buzzerEntry = { teamName: data.teamName, timestamp: timestamp.toFixed(4) };
    buzzerData.push(buzzerEntry);  // Store buzzer data
    console.log(`Buzzer data: `, buzzerEntry);

    // Emit buzzer update to all clients
    io.emit('buzzerUpdate', buzzerEntry);
  });

  // Handle reset buzzer event
  socket.on('resetBuzzer', () => {
    console.log('Buzzer Reset by Admin');
    buzzerData = [];  // Reset the buzzer data
    io.emit('resetBuzzer');  // Broadcast the reset to all clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Disconnected: ${socket.id}`);
  });
});

// Serve login page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/Login.html');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
