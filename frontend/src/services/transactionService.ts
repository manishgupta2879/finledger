
import api from "./api";


// ==========================================
// TRANSACTION TYPE
// ==========================================

// Define the structure of a transaction returned by the backend.
export type Transaction = {
  _id: string;
  transactionId: string;
  type: "Inflow" | "Outflow";
  amount: number;
  tournamentId: string;
  matchId: string;
  paymentType: string;
  createdAt: string;
  updatedAt: string;
};


// ==========================================
// GET TRANSACTIONS
// ==========================================

// Fetch all transactions from the backend.
export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get("/transactions");

  return response.data.data;
};


// ==========================================
// CREATE TRANSACTION
// ==========================================

// Create a new inflow or outflow transaction.
export const createTransaction = async (
  type: "Inflow" | "Outflow",
  amount: number,
  tournamentId: string,
  matchId: string,
  paymentType: string
): Promise<Transaction> => {

  // Send transaction details to the backend.
  const response = await api.post("/transactions", {
    type,
    amount,
    tournamentId,
    matchId,
    paymentType,
  });

  // Return the newly created transaction.
  return response.data.data;
};