const Transaction = require("../models/Transaction");
const Tournament = require("../models/Tournament");
const Match = require("../models/Match");

// Create a new financial transaction
const createTransaction = async (req, res) => {
  try {
    const {
      type,
      amount,
      tournamentId,
      matchId,
      paymentType,
    } = req.body;

    // Validate all required transaction fields
    if (
      !type ||
      amount === undefined ||
      !tournamentId ||
      !matchId ||
      !paymentType
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Type, amount, tournament ID, match ID and payment type are required",
      });
    }

    // Allow only Inflow or Outflow transaction types
    if (!["Inflow", "Outflow"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be Inflow or Outflow",
      });
    }

    // Make sure the transaction amount is greater than zero
    if (Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
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

    // Make sure the selected match belongs to the tournament
    if (match.tournamentId !== tournamentId) {
      return res.status(400).json({
        success: false,
        message: "Match does not belong to selected tournament",
      });
    }

    // Generate the next unique transaction ID
    const lastTransaction = await Transaction.findOne()
      .sort({ createdAt: -1 })
      .lean();

    let nextNumber = 1;

    if (lastTransaction?.transactionId) {
      const number = parseInt(
        lastTransaction.transactionId.replace("TXN", ""),
        10
      );

      if (!isNaN(number)) {
        nextNumber = number + 1;
      }
    }

    const transactionId = `TXN${String(nextNumber).padStart(3, "0")}`;

    // Save the new transaction in the database
    const transaction = await Transaction.create({
      transactionId,
      type,
      amount: Number(amount),
      tournamentId,
      matchId,
      paymentType,
    });

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all recorded transactions in chronological order
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
};