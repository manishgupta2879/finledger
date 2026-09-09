const Transaction = require("../models/Transaction");

// Get the ledger with daily financial balances
const getLedger = async (req, res) => {
  try {
    // Fetch all transactions in chronological order
    const transactions = await Transaction.find().sort({
      createdAt: 1,
    });

    // Group transaction amounts by their transaction date
    const ledgerMap = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt)
        .toISOString()
        .split("T")[0];

      // Create a new daily record when the date is not available
      if (!ledgerMap[date]) {
        ledgerMap[date] = {
          date,
          inward: 0,
          outward: 0,
        };
      }

      // Add inflow amount to the daily inward total
      if (transaction.type === "Inflow") {
        ledgerMap[date].inward += transaction.amount;
      }

      // Add outflow amount to the daily outward total
      if (transaction.type === "Outflow") {
        ledgerMap[date].outward += transaction.amount;
      }
    });

    let runningBalance = 0;

    // Calculate opening and closing balance for each day
    const ledger = Object.values(ledgerMap).map((day) => {
      const opening = runningBalance;

      const closing =
        opening + day.inward - day.outward;

      runningBalance = closing;

      return {
        date: day.date,
        opening,
        inward: day.inward,
        outward: day.outward,
        closing,
      };
    });

    return res.status(200).json({
      success: true,
      data: ledger,
    });
  } catch (error) {
    console.error("Get ledger error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getLedger,
};