const mongoose = require("mongoose");

// Define the structure of financial transaction data
const transactionSchema = new mongoose.Schema(
  {
    // Unique ID generated for each transaction
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Defines whether the transaction is money received or spent
    type: {
      type: String,
      required: true,
      enum: ["Inflow", "Outflow"],
    },

    // Amount involved in the transaction
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Tournament linked with the transaction
    tournamentId: {
      type: String,
      required: true,
      trim: true,
    },

    // Match linked with the transaction
    matchId: {
      type: String,
      required: true,
      trim: true,
    },

    // Describes the payment or expense type
    paymentType: {
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

// Create and export the Transaction model
module.exports = mongoose.model("Transaction", transactionSchema);