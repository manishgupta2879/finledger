const Tournament = require("../models/Tournament");

// Create a new tournament
const createTournament = async (req, res) => {
  try {
    const { tournamentName } = req.body;

    // Validate the required tournament name
    if (!tournamentName) {
      return res.status(400).json({
        success: false,
        message: "Tournament name is required",
      });
    }

    // Find the latest tournament to generate the next ID
    const lastTournament = await Tournament.findOne()
      .sort({ createdAt: -1 })
      .lean();

    let nextNumber = 1;

    if (lastTournament?.tournamentId) {
      const number = parseInt(
        lastTournament.tournamentId.replace("T", ""),
        10
      );

      if (!isNaN(number)) {
        nextNumber = number + 1;
      }
    }

    // Generate the next unique tournament ID
    const tournamentId = `T${String(nextNumber).padStart(3, "0")}`;

    // Save the new tournament in the database
    const tournament = await Tournament.create({
      tournamentId,
      tournamentName,
    });

    res.status(201).json({
      success: true,
      message: "Tournament created successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("Create tournament error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all tournaments in reverse creation order
const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: tournaments,
    });
  } catch (error) {
    console.error("Get tournaments error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createTournament,
  getTournaments,
};