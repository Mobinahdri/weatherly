require("dotenv").config();

const express = require("express");
const cors = require("cors");

const weatherRoutes = require("./routes/weatherRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Weatherly Backend Running 🚀");
});

app.use("/api/weather", weatherRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
