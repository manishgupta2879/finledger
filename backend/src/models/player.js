const mongoose = require("mongoose");

// Define the structure of player data
const playerSchema = new mongoose.Schema(
  {
    // Unique ID generated for each player
    playerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Name of the player
    playerName: {
      type: String,
      required: true,
      trim: true,
    },

    // Match linked with the player
    matchId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create and export the Player model
module.exports = mongoose.model("Player", playerSchema);