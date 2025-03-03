const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the build folder
app.use(express.static(path.join(__dirname, "..", "build")));

// Handle client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});