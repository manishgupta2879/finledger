const Match = require("../models/Match");
const Tournament = require("../models/Tournament");

// Create a new match for the selected tournament
const createMatch = async (req, res) => {
  try {
    const { matchName, tournamentId } = req.body;

    // Validate the required match and tournament fields
    if (!matchName || !tournamentId) {
      return res.status(400).json({
        success: false,
        message: "Match name and tournament ID are required",
      });
    }

    // Check whether the selected tournament exists
    const tournament = await Tournament.findOne({
      tournamentId,
    });

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }

    // Find the latest match to generate the next ID
    const lastMatch = await Match.findOne()
      .sort({ createdAt: -1 })
      .lean();

    let nextNumber = 1;

    if (lastMatch?.matchId) {
      const number = parseInt(
        lastMatch.matchId.replace("M", ""),
        10
      );

      if (!isNaN(number)) {
        nextNumber = number + 1;
      }
    }

    // Generate the next unique match ID
    const matchId = `M${String(nextNumber).padStart(3, "0")}`;

    // Save the new match in the database
    const match = await Match.create({
      matchId,
      matchName,
      tournamentId,
    });

    res.status(201).json({
      success: true,
      message: "Match created successfully",
      data: match,
    });
  } catch (error) {
    console.error("Create match error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all matches in reverse creation order
const getMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: matches,
    });
  } catch (error) {
    console.error("Get matches error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createMatch,
  getMatches,
};