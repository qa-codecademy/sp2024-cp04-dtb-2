const exp = require("constants");
const express = require("express");
const path = require("path");
const app = express();

app.use("/js", express.static(path.resolve(__dirname, "js")));
app.get("/*", (req,res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
});

app.listen(process.env.PORT || 5000, () =>console.log("Server is running..."));