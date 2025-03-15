        // ✅ Initialize Socket.io (Local or Deployed Environment)
        const socket = io(
            window.location.hostname === 'localhost'
                ? 'http://localhost:3000'
                : 'https://quickbuzz-dtle.onrender.com'
        );

        // ✅ Fetch Team Data from Session Storage
        const teamName = sessionStorage.getItem('teamName') || "Team_X ✅";
        document.getElementById('teamNameDisplay').textContent = `Team: ${teamName} ✅`;

        // Stopwatch Variables
let buzzerPressed = false;
    let startTime = performance.now();
    let currentDisplayedTime = 0;

    // ⏱️ Start Stopwatch when Buzzer is Active
    function updateStopwatch() {
        if (!buzzerPressed) {
            currentDisplayedTime = Math.floor(performance.now() - startTime);
            document.getElementById('stopwatch').textContent = `⏱️ ${currentDisplayedTime} ms`;
            requestAnimationFrame(updateStopwatch);
        }
    }

    function startStopwatch() {
        startTime = performance.now();
        buzzerPressed = false;
        currentDisplayedTime = 0;
        requestAnimationFrame(updateStopwatch);
    }

    startStopwatch();

    // 🛎️ Handle Buzzer Press (Send Directly to Admin via Socket.io)
    function pressBuzzer() {
        if (buzzerPressed) return;
        buzzerPressed = true;
        const exactTime = currentDisplayedTime;
        document.getElementById('buzzerStatus').textContent = `⏳ Buzzer Pressed at ${exactTime} ms!`;
        socket.emit('buzzerPressed', { teamName, timestamp: exactTime });
    }


        // 🔄 Listen for Reset Event from Admin
        socket.on('resetBuzzer', () => {
            buzzerPressed = false;
            document.getElementById('buzzer').disabled = true;
            document.getElementById('buzzerStatus').textContent = '🔁 Waiting for admin to activate buzzer!';
            document.getElementById('stopwatch').style.display = 'none';
        });

        // 🔄 Listen for Activate Buzzer Event from Admin
        // Show stopwatch when buzzer is activated
socket.on("activateBuzzer", () => {
    document.getElementById("stopwatch").style.display = "block"; // Ensure stopwatch is visible
    buzzerPressed = false;
    document.getElementById("buzzer").disabled = false;
    document.getElementById("buzzerStatus").textContent = "✅ Ready to buzz!";
    startStopwatch(); // Start the stopwatch
});


        // 🔄 Listen for Deactivate Buzzer Event from Admin
socket.on("deactivateBuzzer", () => {
    buzzerPressed = true; // Stop stopwatch loop
    document.getElementById("buzzer").disabled = true;
    document.getElementById("buzzerStatus").textContent = "❌ Buzzer Deactivated by Admin!";
});


        // 🔒 Logout Function
        function logout() {
            sessionStorage.clear();
            window.location.href = 'index.html';
        }
        // 🔄 Listen for leaderboard updates from the server
// 🔄 Listen for leaderboard updates from the server
socket.on("updateLeaderboard", (leaderboard) => {
    console.log("Received Leaderboard Update:", leaderboard); // ✅ Debugging

    // Find the team's position
    const teamEntry = leaderboard.find(entry => entry.teamName === teamName);
    
    if (teamEntry) {
        document.getElementById('buzzerStatus').textContent = `🎉 Your Position: ${teamEntry.position}`;
    }
});
// 🔄 Listen for position update from the server
// Listen for your position and update the UI
// ✅ Listen for yourPosition event and display it
socket.on("yourPosition", (data) => {
    console.log("📊 Position Received:", data);
    if (data.teamName === teamName) {
        document.getElementById('buzzerStatus').textContent = `🎉 Your Position: ${data.position}`;
    }
});




