const exp = require("constants");
const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.resolve(__dirname)));
// app.use('/js', express.static(path.join(__dirname, 'js')));

app.get("/*", (req,res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});