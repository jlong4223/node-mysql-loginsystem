const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Home Page</h1>");
});

const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
