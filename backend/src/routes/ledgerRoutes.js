const express = require("express");

const {
  getLedger,
} = require("../controllers/ledgerController");

const router = express.Router();

// Get ledger data
router.get("/", getLedger);

module.exports = router;