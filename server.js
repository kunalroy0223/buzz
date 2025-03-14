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
let buzzerActive = false; // Track if the buzzer is active or not

// Serve static files
app.use(express.static('public'));

// Listen for socket connections
io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Send current buzzer state (active/inactive) to the new client
  socket.emit('buzzerState', buzzerActive);

  // Handle buzzer pressed event
  socket.on('buzzerPressed', (data) => {
    if (buzzerActive) {  // Only register buzzer presses when the buzzer is active
      console.log(`Buzzer Pressed by ${data.teamName}`);
      const timestamp = performance.now();
      const buzzerEntry = { teamName: data.teamName, timestamp: timestamp.toFixed(4) };
      buzzerData.push(buzzerEntry);  // Store buzzer data
      console.log(`Buzzer data: `, buzzerEntry);

      // Emit buzzer update to all clients (teams and admin)
      io.emit('buzzerUpdate', buzzerEntry);
    }
  });

  // Handle reset buzzer event (reset buzzer for all teams)
  socket.on('resetBuzzer', () => {
    console.log('Buzzer Reset by Admin');
    buzzerData = [];  // Reset the buzzer data
    io.emit('resetBuzzer');  // Broadcast the reset to all clients
  });

  // Handle activate buzzer event (admin activates the buzzer)
  socket.on('activateBuzzer', () => {
    console.log('Buzzer Activated by Admin');
    buzzerActive = true;  // Set buzzer as active
    io.emit('activateBuzzer');  // Broadcast the activation to all clients
  });

  // Handle deactivate buzzer event (admin deactivates the buzzer)
  socket.on('deactivateBuzzer', () => {
    console.log('Buzzer Deactivated by Admin');
    buzzerActive = false;  // Set buzzer as inactive
    io.emit('deactivateBuzzer');  // Broadcast the deactivation to all clients
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
