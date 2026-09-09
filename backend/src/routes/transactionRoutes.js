const express = require("express");

const {
  createTransaction,
  getTransactions,
} = require("../controllers/transactionController");

const router = express.Router();

// Create a transaction
router.post("/", createTransaction);

// Get all transactions
router.get("/", getTransactions);

module.exports = router;