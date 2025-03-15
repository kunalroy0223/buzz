        // Initialize Socket.IO Connection
        const socket = io(
            window.location.hostname === 'localhost'
                ? 'http://localhost:3000'  // Local development
                : 'https://quickbuzz-dtle.onrender.com'  // Deployed backend
        );

        const leaderboardBody = document.getElementById("leaderboardBody");
        let buzzerData = [];
        let buzzerActivated = false; // Track buzzer state

        // ✅ Listen for buzzer press event
 socket.on("buzzerUpdate", (data) => {
    console.log("🔔 Buzzer Data Received:", data);

    // Avoid duplicate entries by checking teamName
    if (!buzzerData.some(item => item.teamName === data.teamName)) {
        buzzerData.push(data);
        updateLeaderboard();

        // Calculate and send individual team positions
        broadcastTeamPositions();
    }
});

        // ✅ Listen for reset event
        socket.on("resetBuzzer", () => {
            console.log("🔄 Buzzers Reset");
            buzzerData = [];
            updateLeaderboard();
        });

        // 📊 Update the leaderboard with position tracking
function updateLeaderboard() {
    leaderboardBody.innerHTML = "";

    // Sort teams by buzzer press time (ascending)
    buzzerData.sort((a, b) => a.timestamp - b.timestamp);

    buzzerData.forEach((item, index) => {
        const { teamName, timestamp } = item;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td> <!-- Position starts from 1 -->
            <td>${teamName}</td>
            <td>⏱️ ${timestamp} ms</td>
        `;
        leaderboardBody.appendChild(row);
    });

    // Emit updated leaderboard to all clients
    socket.emit("updateLeaderboard", buzzerData);
}

// 📢 Broadcast team positions to each client
// 📢 Broadcast team positions to each client
// 📊 Broadcast team positions to each client
function broadcastTeamPositions() {
  if (!buzzerData.length) return; // Ensure there's data to process

  try {
    // Sort teams by their timestamp (ascending order means fastest first)
    buzzerData.sort((a, b) => a.timestamp - b.timestamp);

    buzzerData.forEach((item, index) => {
      if (item.teamName) {
        console.log(`📤 Sending position: ${index + 1} to ${item.teamName}`);
        io.emit('yourPosition', { teamName: item.teamName, position: index + 1 });
      }
    });
  } catch (error) {
    console.error("❌ Error broadcasting positions:", error);
  }
}


// 🛑 Reset Buzzer (admin control)
function resetBuzzer() {
    socket.emit("resetBuzzer");
    buzzerData = [];
    updateLeaderboard();
    console.log("📣 Reset event sent to server.");
}

// 🚨 Activate Buzzer (enable for teams)
function activateBuzzer() {
    if (!buzzerActivated) {
        socket.emit("activateBuzzer");
        buzzerActivated = true;
        toggleBuzzerButtons(true);
        console.log("📣 Buzzer activated for teams.");
    }
}

// 🛑 Deactivate Buzzer (disable for teams)
function deactivateBuzzer() {
    if (buzzerActivated) {
        socket.emit("deactivateBuzzer");
        buzzerActivated = false;
        toggleBuzzerButtons(false);
        console.log("📣 Buzzer deactivated.");
    }
}

// 🔘 Toggle Buzzer Activation/Deactivation Buttons
function toggleBuzzerButtons(active) {
    document.getElementById("activateBuzzerButton").style.display = active ? "none" : "inline-block";
    document.getElementById("deactivateButton").style.display = active ? "inline-block" : "none";
}

// 🔐 Handle Admin Logout
function handleLogout() {
    window.location.href = "index.html";
}
