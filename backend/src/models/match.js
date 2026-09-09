const mongoose = require("mongoose");

// Define the structure of match data
const matchSchema = new mongoose.Schema(
  {
    // Unique ID generated for each match
    matchId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Name of the match
    matchName: {
      type: String,
      required: true,
      trim: true,
    },

    // Tournament linked with the match
    tournamentId: {
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

// Create and export the Match model
module.exports = mongoose.model("Match", matchSchema);