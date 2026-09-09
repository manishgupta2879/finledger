const Player = require("../models/Player");
const Match = require("../models/Match");

// Create a new player for the selected match
const createPlayer = async (req, res) => {
  try {
    const { playerName, matchId } = req.body;

    // Validate the required player and match fields
    if (!playerName || !matchId) {
      return res.status(400).json({
        success: false,
        message: "Player name and match ID are required",
      });
    }

    // Check whether the selected match exists
    const match = await Match.findOne({
      matchId,
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    // Find the latest player to generate the next ID
    const lastPlayer = await Player.findOne()
      .sort({ createdAt: -1 })
      .lean();

    let nextNumber = 1;

    if (lastPlayer?.playerId) {
      const number = parseInt(
        lastPlayer.playerId.replace("P", ""),
        10
      );

      if (!isNaN(number)) {
        nextNumber = number + 1;
      }
    }

    // Generate the next unique player ID
    const playerId = `P${String(nextNumber).padStart(3, "0")}`;

    // Save the new player in the database
    const player = await Player.create({
      playerId,
      playerName,
      matchId,
    });

    res.status(201).json({
      success: true,
      message: "Player created successfully",
      data: player,
    });
  } catch (error) {
    console.error("Create player error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all players in reverse creation order
const getPlayers = async (req, res) => {
  try {
    const players = await Player.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: players,
    });
  } catch (error) {
    console.error("Get players error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createPlayer,
  getPlayers,
};