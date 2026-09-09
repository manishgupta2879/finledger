const mongoose = require("mongoose");

// Define the structure of tournament data
const tournamentSchema = new mongoose.Schema(
  {
    // Unique ID generated for each tournament
    tournamentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Name of the tournament
    tournamentName: {
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

// Create and export the Tournament model
module.exports = mongoose.model("Tournament", tournamentSchema);