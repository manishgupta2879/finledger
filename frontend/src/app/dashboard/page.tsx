"use client";

import { useState } from "react";

type Transaction = {
  id: number;
  match: string;
  type: "Inflow" | "Outflow";
  category: string;
  description: string;
  amount: number;
  date: string;
};

const transactions: Transaction[] = [
  {
    id: 1,
    match: "Match #101",
    type: "Inflow",
    category: "Opponent Fee",
    description: "Opponent team participation fee",
    amount: 15000,
    date: "08 Sep 2026",
  },
  {
    id: 2,
    match: "Match #101",
    type: "Inflow",
    category: "Kitty Deduction",
    description: "Kitty amount collected from players",
    amount: 5000,
    date: "08 Sep 2026",
  },
  {
    id: 3,
    match: "Match #101",
    type: "Inflow",
    category: "Direct Player Payment",
    description: "Direct payment received from player",
    amount: 2500,
    date: "08 Sep 2026",
  },
  {
    id: 4,
    match: "Match #101",
    type: "Outflow",
    category: "Ground / Venue Cost",
    description: "Cricket ground booking",
    amount: 8000,
    date: "08 Sep 2026",
  },
  {
    id: 5,
    match: "Match #101",
    type: "Outflow",
    category: "Equipment",
    description: "Balls and match equipment",
    amount: 2500,
    date: "08 Sep 2026",
  },
  {
    id: 6,
    match: "Match #101",
    type: "Outflow",
    category: "Umpire Fees",
    description: "Umpire payment",
    amount: 3000,
    date: "08 Sep 2026",
  },
  {
    id: 7,
    match: "Match #102",
    type: "Inflow",
    category: "Opponent Fee",
    description: "Opponent team participation fee",
    amount: 12000,
    date: "07 Sep 2026",
  },
];

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

export default function DashboardPage() {
  const [selectedMatch, setSelectedMatch] = useState("All Matches");

  const matches = [
    "All Matches",
    ...Array.from(new Set(transactions.map((item) => item.match))),
  ];

  const filteredTransactions =
    selectedMatch === "All Matches"
      ? transactions
      : transactions.filter((item) => item.match === selectedMatch);

  const totalInflow = filteredTransactions
    .filter((item) => item.type === "Inflow")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalOutflow = filteredTransactions
    .filter((item) => item.type === "Outflow")
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = totalInflow - totalOutflow;

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Financial Ledger
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Match-wise financial management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              K
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Admin
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Page title */}
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Dashboard
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track match inflows, outflows and current balance.
            </p>
          </div>

        
        </div>

        {/* Match Filter */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Match
              </p>

              <p className="text-xs text-slate-500">
                View ledger for a specific match
              </p>
            </div>

            <select
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-900"
            >
              {matches.map((match) => (
                <option key={match} value={match}>
                  {match}
                </option>
              ))}
            </select>
          </div>
        </div>

       

        

       
      </div>
    </main>
  );
}

