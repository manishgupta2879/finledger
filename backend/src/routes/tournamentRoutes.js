const express = require("express");

const {
  createTournament,
  getTournaments,
} = require("../controllers/tournamentController");

const router = express.Router();

// Create a tournament
router.post("/", createTournament);

// Get all tournaments
router.get("/", getTournaments);

module.exports = router;