import api from "./api";

// Ledger row data structure
export type LedgerRow = {
  date: string;
  opening: number;
  inward: number;
  outward: number;
  closing: number;
};

// Get ledger data
export const getLedger = async (): Promise<LedgerRow[]> => {
  const response = await api.get("/ledger");

  return response.data.data;
};