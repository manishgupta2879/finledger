const express = require("express");

const {
  createMatch,
  getMatches,
} = require("../controllers/matchController");

const router = express.Router();

// Create a match
router.post("/", createMatch);

// Get all matches
router.get("/", getMatches);

module.exports = router;