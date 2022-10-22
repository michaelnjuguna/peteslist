const express = require("express");
const app = express();

// PORT
const PORT = 3000;
app.use(express.json());
app.get("/", (req, res) => {
   res.send("This is home page.");
});

app.post("/", (req, res) => {
   res.send("This is home page with post request.");
});


app.listen(PORT, () => {
   console.log(`Server is running on PORT: ${PORT}`);
});