const express = require("express");

const {
  createPlayer,
  getPlayers,
} = require("../controllers/playerController");

const router = express.Router();

// Create a player
router.post("/", createPlayer);

// Get all players
router.get("/", getPlayers);

module.exports = router;