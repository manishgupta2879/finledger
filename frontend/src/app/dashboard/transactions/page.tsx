"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  RefreshCw,
  X,
  Search,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
} from "lucide-react";

import {
  getTransactions,
  createTransaction,
  Transaction,
} from "@/services/transactionService";

import {
  getTournaments,
  Tournament,
} from "@/services/tournamentService";

import {
  getMatches,
  Match,
} from "@/services/matchService";

export default function TransactionsPage() {
  // Store transactions, tournaments and matches fetched from the backend.
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  // Manage loading and transaction creation states.
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Controls the Add Transaction modal.
  const [showModal, setShowModal] = useState(false);

  // Store transaction form values.
  const [type, setType] = useState<"Inflow" | "Outflow">("Inflow");
  const [amount, setAmount] = useState("");
  const [tournamentId, setTournamentId] = useState("");
  const [matchId, setMatchId] = useState("");
  const [paymentType, setPaymentType] = useState("");

  // Store search text.
  const [search, setSearch] = useState("");

  // Store success and error messages.
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // Available transaction types for Inflow.
  const inflowTypes = [
    "Upfront Ground Fee",
    "Direct Player Payment",
    "Tournament Entry Fee",
  ];

  // Available transaction types for Outflow.
  const outflowTypes = [
    "Ground / Venue",
    "Equipment/Umpire/Transport",
    //"Refund / Adjustment",
  ];


  // ==========================================
  // GET TRANSACTIONS
  // ==========================================

  // Fetch all transactions from the backend and update the ledger table.
  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTransactions();

      setTransactions(data);
    } catch (error) {
      console.error("Get transactions error:", error);

      setError(
        "Unable to load transactions. Please check the backend server."
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // GET TOURNAMENTS
  // Used for Tournament ID dropdown
  // ==========================================

  // Fetch tournaments for the transaction form.
  const loadTournaments = async () => {
    try {
      const data = await getTournaments();

      setTournaments(data);
    } catch (error) {
      console.error("Get tournaments error:", error);

      setError("Unable to load tournaments.");
    }
  };


  // ==========================================
  // GET MATCHES
  // Used for Match ID dropdown
  // ==========================================

  // Fetch matches for the transaction form.
  const loadMatches = async () => {
    try {
      const data = await getMatches();

      setMatches(data);
    } catch (error) {
      console.error("Get matches error:", error);

      setError("Unable to load matches.");
    }
  };


  // ==========================================
  // PAGE LOAD
  // ==========================================

  // Load all required data when the page opens.
  useEffect(() => {
    loadTransactions();
    loadTournaments();
    loadMatches();
  }, []);


  // ==========================================
  // CREATE TRANSACTION
  // ==========================================

  // Handle Add Transaction form submission.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = Number(amount);

    // Validate amount.
    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    // Validate Tournament selection.
    if (!tournamentId) {
      setError("Please select a tournament.");
      return;
    }

    // Validate Match selection.
    if (!matchId) {
      setError("Please select a match.");
      return;
    }

    // Validate Payment/Expense Type.
    if (!paymentType) {
      setError("Please select a payment type.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      // Send the transaction details to the backend.
      // Backend automatically generates the Transaction ID.
      await createTransaction(
        type,
        numericAmount,
        tournamentId,
        matchId,
        paymentType
      );

      // Clear form after successful creation.
      setAmount("");
      setTournamentId("");
      setMatchId("");
      setPaymentType("");
      setType("Inflow");

      // Close the modal.
      setShowModal(false);

      setSuccess("Transaction created successfully.");

      // Reload transactions so the new entry appears in the table.
      await loadTransactions();

      // Remove success message after 3 seconds.
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Create transaction error:", error);

      setError(
        "Unable to create transaction. Please try again."
      );
    } finally {
      setCreating(false);
    }
  };


  // ==========================================
  // SEARCH
  // ==========================================

  // Filter transactions by ID, type, payment type,
  // tournament ID or match ID.
  const filteredTransactions = transactions.filter(
    (transaction) => {
      const value = search.toLowerCase();

      return (
        transaction.transactionId
          .toLowerCase()
          .includes(value) ||
        transaction.type
          .toLowerCase()
          .includes(value) ||
        transaction.paymentType
          .toLowerCase()
          .includes(value) ||
        transaction.tournamentId
          .toLowerCase()
          .includes(value) ||
        transaction.matchId
          .toLowerCase()
          .includes(value)
      );
    }
  );


  // ==========================================
  // SUMMARY CALCULATIONS
  // ==========================================

  // Calculate total money received.
  const totalInflow = transactions
    .filter((transaction) => transaction.type === "Inflow")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  // Calculate total money spent.
  const totalOutflow = transactions
    .filter((transaction) => transaction.type === "Outflow")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  // Current balance = total inflow - total outflow.
  const balance = totalInflow - totalOutflow;


  // Show different payment/expense options based on transaction type.
  const availablePaymentTypes =
    type === "Inflow" ? inflowTypes : outflowTypes;


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="border-b border-slate-200 bg-white px-8 py-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-slate-500">
              Financial
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Financial Ledger
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track all inflows and outflows
            </p>

          </div>


          {/* Open the transaction modal and refresh master data
              so the dropdowns contain the latest records. */}

          <button
            onClick={() => {
              setShowModal(true);
              setError("");
              loadTournaments();
              loadMatches();
            }}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={18} />
            Add Transaction
          </button>

        </div>

      </div>


      {/* ======================================
          CONTENT
      ====================================== */}

      <div className="p-8">

        {/* SUCCESS */}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}


        {/* ERROR */}

        {error && (
          <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">

            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700"
            >
              <X size={18} />
            </button>

          </div>
        )}


        {/* ====================================
            SUMMARY
        ==================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Total Inflow */}

          <div className="rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Inflow
                </p>

                <p className="mt-2 text-2xl font-bold text-green-600">
                  ₹{totalInflow.toLocaleString("en-IN")}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50">

                <ArrowDownCircle
                  size={23}
                  className="text-green-600"
                />

              </div>

            </div>

          </div>


          {/* Total Outflow */}

          <div className="rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Outflow
                </p>

                <p className="mt-2 text-2xl font-bold text-red-600">
                  ₹{totalOutflow.toLocaleString("en-IN")}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50">

                <ArrowUpCircle
                  size={23}
                  className="text-red-600"
                />

              </div>

            </div>

          </div>


          {/* Current Balance */}

          <div className="rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Balance
                </p>

                <p
                  className={`mt-2 text-2xl font-bold ${
                    balance >= 0
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  ₹{balance.toLocaleString("en-IN")}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">

                <Wallet
                  size={23}
                  className="text-blue-600"
                />

              </div>

            </div>

          </div>

        </div>


        {/* ====================================
            LEDGER TABLE
        ==================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

            <div>

              <h2 className="text-base font-semibold text-slate-900">
                Ledger Entries
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Chronological financial records
              </p>

            </div>


            <div className="flex items-center gap-3">

              {/* Search */}

              <div className="relative">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search ledger..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-56 rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-900"
                />

              </div>


              {/* Refresh the transaction list from the backend. */}

              <button
                onClick={loadTransactions}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >

                <RefreshCw
                  size={16}
                  className={
                    loading ? "animate-spin" : ""
                  }
                />

                Refresh

              </button>

            </div>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr className="border-b border-slate-200 text-left">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Transaction ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Payment Type
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tournament
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Match
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                </tr>

              </thead>


              <tbody>

                {/* Show loading state while transactions are being fetched. */}

                {loading && (

                  <tr>

                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >

                      <div className="flex flex-col items-center gap-3">

                        <RefreshCw
                          size={24}
                          className="animate-spin text-slate-400"
                        />

                        Loading ledger...

                      </div>

                    </td>

                  </tr>

                )}


                {/* Show an empty state when no transactions match the search. */}

                {!loading &&
                  filteredTransactions.length === 0 && (

                    <tr>

                      <td
                        colSpan={7}
                        className="px-6 py-14 text-center"
                      >

                        <Wallet
                          size={40}
                          className="mx-auto mb-3 text-slate-300"
                        />

                        <p className="font-medium text-slate-600">
                          No ledger entries found
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Add your first financial transaction
                        </p>

                      </td>

                    </tr>

                  )}


                {/* Render each filtered transaction as a table row. */}

                {!loading &&
                  filteredTransactions.map(
                    (transaction) => (

                      <tr
                        key={transaction._id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >

                        {/* Transaction ID */}

                        <td className="px-6 py-4">

                          <span className="rounded-md bg-slate-100 px-3 py-1 font-mono text-sm font-semibold text-slate-700">
                            {transaction.transactionId}
                          </span>

                        </td>


                        {/* Inflow / Outflow */}

                        <td className="px-6 py-4">

                          {transaction.type ===
                          "Inflow" ? (

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">

                              <ArrowDownCircle size={14} />

                              Inflow

                            </span>

                          ) : (

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">

                              <ArrowUpCircle size={14} />

                              Outflow

                            </span>

                          )}

                        </td>


                        {/* Payment / Expense Type */}

                        <td className="px-6 py-4">

                          <p className="text-sm font-medium text-slate-800">
                            {transaction.paymentType}
                          </p>

                        </td>


                        {/* Amount */}

                        <td className="px-6 py-4">

                          <span
                            className={`text-sm font-bold ${
                              transaction.type ===
                              "Inflow"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >

                            {transaction.type ===
                            "Inflow"
                              ? "+"
                              : "-"}

                            ₹

                            {transaction.amount.toLocaleString(
                              "en-IN"
                            )}

                          </span>

                        </td>


                        {/* Tournament ID */}

                        <td className="px-6 py-4">

                          <span className="rounded-md bg-slate-100 px-3 py-1 font-mono text-sm font-semibold text-slate-700">
                            {transaction.tournamentId}
                          </span>

                        </td>


                        {/* Match ID */}

                        <td className="px-6 py-4">

                          <span className="rounded-md bg-blue-50 px-3 py-1 font-mono text-sm font-semibold text-blue-700">
                            {transaction.matchId}
                          </span>

                        </td>


                        {/* Transaction Date */}

                        <td className="px-6 py-4 text-sm text-slate-500">

                          {new Date(
                            transaction.createdAt
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}

                        </td>

                      </tr>

                    )
                  )}

              </tbody>

            </table>

          </div>

        </div>

      </div>


      {/* ======================================
          CREATE TRANSACTION MODAL
      ====================================== */}

      {showModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"

          // Close the modal when the user clicks outside the modal box.
          onMouseDown={(e) => {

            if (e.target === e.currentTarget) {
              setShowModal(false);
            }

          }}
        >

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Add Transaction
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Record a financial event
                </p>

              </div>


              {/* Close the modal. */}

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* Transaction Type */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Transaction Type
                </label>

                <div className="grid grid-cols-2 gap-3">

                  {/* Select Inflow and reset payment type. */}

                  <button
                    type="button"
                    onClick={() => {
                      setType("Inflow");
                      setPaymentType("");
                      setError("");
                    }}
                    className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                      type === "Inflow"
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >

                    <ArrowDownCircle
                      size={18}
                      className="mx-auto mb-1"
                    />

                    Inflow

                  </button>


                  {/* Select Outflow and reset payment type. */}

                  <button
                    type="button"
                    onClick={() => {
                      setType("Outflow");
                      setPaymentType("");
                      setError("");
                    }}
                    className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                      type === "Outflow"
                        ? "border-red-600 bg-red-50 text-red-700"
                        : "border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >

                    <ArrowUpCircle
                      size={18}
                      className="mx-auto mb-1"
                    />

                    Outflow

                  </button>

                </div>

              </div>


              {/* Payment / Expense Type */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">

                  {type === "Inflow"
                    ? "Payment Type"
                    : "Expense Type"}

                  <span className="ml-1 text-red-500">
                    *
                  </span>

                </label>

                <select
                  value={paymentType}
                  onChange={(e) => {
                    setPaymentType(e.target.value);
                    setError("");
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                >

                  <option value="">
                    Select{" "}
                    {type === "Inflow"
                      ? "Payment Type"
                      : "Expense Type"}
                  </option>


                  {/* Show payment or expense options
                      according to the selected transaction type. */}

                  {availablePaymentTypes.map(
                    (item) => (

                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* Amount */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">

                  Amount

                  <span className="ml-1 text-red-500">
                    *
                  </span>

                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError("");
                    }}
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />

                </div>

              </div>


              {/* Tournament */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">

                  Tournament ID

                  <span className="ml-1 text-red-500">
                    *
                  </span>

                </label>

                <select
                  value={tournamentId}
                  onChange={(e) => {
                    setTournamentId(e.target.value);

                    // Reset Match because it depends on the selected tournament.
                    setMatchId("");

                    setError("");
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                >

                  <option value="">
                    Select Tournament
                  </option>


                  {/* Populate tournament dropdown from backend data. */}

                  {tournaments.map(
                    (tournament) => (

                      <option
                        key={tournament._id}
                        value={tournament.tournamentId}
                      >
                        {tournament.tournamentId} -{" "}
                        {tournament.tournamentName}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* Match */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">

                  Match ID

                  <span className="ml-1 text-red-500">
                    *
                  </span>

                </label>

                <select
                  value={matchId}
                  onChange={(e) => {
                    setMatchId(e.target.value);
                    setError("");
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                >

                  <option value="">
                    Select Match
                  </option>


                  {/* Show only matches belonging to the selected tournament. */}

                  {matches
                    .filter(
                      (match) =>
                        !tournamentId ||
                        match.tournamentId ===
                          tournamentId
                    )
                    .map((match) => (

                      <option
                        key={match._id}
                        value={match.matchId}
                      >
                        {match.matchId} -{" "}
                        {match.matchName}
                      </option>

                    ))}

                </select>

              </div>


              {/* Buttons */}

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                {/* Cancel and reset the form. */}

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setAmount("");
                    setTournamentId("");
                    setMatchId("");
                    setPaymentType("");
                    setType("Inflow");
                  }}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>


                {/* Submit the transaction to the backend. */}

                <button
                  type="submit"

                  // Disable until all required fields are filled
                  // or while the API request is running.
                  disabled={
                    creating ||
                    !amount ||
                    !tournamentId ||
                    !matchId ||
                    !paymentType
                  }

                  className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {creating && (
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {creating
                    ? "Saving..."
                    : "Add Transaction"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}