const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const tournamentRoutes = require("./routes/tournamentRoutes");
const matchRoutes = require("./routes/matchRoutes");
const playerRoutes = require("./routes/playerRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS and JSON requests
app.use(cors());
app.use(express.json());

// Check if the API is running
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Financial Ledger API is running",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Master and financial routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/ledger", ledgerRoutes);

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});