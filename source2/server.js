const express = require("express");
const path = require("path");
const app = express();

// Middleware to set cache control headers
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// Serve static files from the 'js' folder
app.use('/js', express.static(path.join(__dirname, 'js')));

// Serve static files from the 'data' folder
app.use('/data', express.static(path.join(__dirname, 'data')));

// Serve static files from the root directory (for the HTML file and other assets)
app.use(express.static(path.resolve(__dirname)));

// Fallback to index.html for any routes that don't match
app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});