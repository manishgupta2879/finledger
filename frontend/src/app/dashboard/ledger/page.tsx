"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";

import { getLedger, LedgerRow } from "@/services/ledgerService";

export default function LedgerPage() {
  // Store daily ledger data fetched from the backend.
  const [ledger, setLedger] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(true);


  // ==========================================
  // GET LEDGER
  // ==========================================

  // Fetch the calculated daily ledger from the backend.
  const loadLedger = async () => {
    try {
      setLoading(true);

      const data = await getLedger();

      setLedger(data);
    } catch (error) {
      console.error("Get ledger error:", error);
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // PAGE LOAD
  // ==========================================

  // Load ledger data when the page opens.
  useEffect(() => {
    loadLedger();
  }, []);


  // ==========================================
  // SUMMARY CALCULATIONS
  // ==========================================

  // Calculate total inward amount from all ledger days.
  const totalInward = ledger.reduce(
    (sum, row) => sum + row.inward,
    0
  );

  // Calculate total outward amount from all ledger days.
  const totalOutward = ledger.reduce(
    (sum, row) => sum + row.outward,
    0
  );

  // The closing balance of the latest day is the current balance.
  const closingBalance =
    ledger.length > 0
      ? ledger[ledger.length - 1].closing
      : 0;


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-900">
            Transaction Ledger
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Daily opening, inward, outward and closing balance
          </p>

        </div>


        {/* Refresh the latest ledger data from the backend. */}

        <button
          onClick={loadLedger}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >

          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />

          Refresh

        </button>

      </div>


      {/* ======================================
          SUMMARY
      ====================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* Closing Balance */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-slate-100 p-3">

              <Wallet size={22} />

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Closing Balance
              </p>

              <p className="text-2xl font-bold text-slate-900">
                ₹{closingBalance.toLocaleString("en-IN")}
              </p>

            </div>

          </div>

        </div>


        {/* Total Inward */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-slate-100 p-3">

              <TrendingUp size={22} />

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Total Inward
              </p>

              <p className="text-2xl font-bold text-slate-900">
                ₹{totalInward.toLocaleString("en-IN")}
              </p>

            </div>

          </div>

        </div>


        {/* Total Outward */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-slate-100 p-3">

              <TrendingDown size={22} />

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Total Outward
              </p>

              <p className="text-2xl font-bold text-slate-900">
                ₹{totalOutward.toLocaleString("en-IN")}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================
          LEDGER TABLE
      ====================================== */}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-4">

          <div className="flex items-center gap-2">

            <BookOpen size={20} />

            <h2 className="font-semibold text-slate-900">
              Daily Ledger
            </h2>

          </div>

        </div>


        {/* Show loading, empty state or ledger table based
            on the current ledger state. */}

        {loading ? (

          <div className="p-10 text-center text-sm text-slate-500">

            Loading ledger...

          </div>

        ) : ledger.length === 0 ? (

          <div className="p-10 text-center">

            <p className="text-sm text-slate-500">
              No transactions found.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Add transactions to generate the ledger.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Opening
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Inward
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Outward
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Closing
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {/* Render each day's opening, inward, outward
                    and closing balance. */}

                {ledger.map((row) => (

                  <tr
                    key={row.date}
                    className="hover:bg-slate-50"
                  >

                    {/* Date */}

                    <td className="px-6 py-4 text-sm font-medium text-slate-900">

                      {new Date(
                        row.date
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}

                    </td>


                    {/* Opening Balance */}

                    <td className="px-6 py-4 text-right text-sm text-slate-700">

                      ₹{row.opening.toLocaleString("en-IN")}

                    </td>


                    {/* Inward Amount */}

                    <td className="px-6 py-4 text-right text-sm font-medium text-green-600">

                      {row.inward > 0
                        ? `₹${row.inward.toLocaleString("en-IN")}`
                        : "—"}

                    </td>


                    {/* Outward Amount */}

                    <td className="px-6 py-4 text-right text-sm font-medium text-red-600">

                      {row.outward > 0
                        ? `₹${row.outward.toLocaleString("en-IN")}`
                        : "—"}

                    </td>


                    {/* Closing Balance */}

                    <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">

                      ₹{row.closing.toLocaleString("en-IN")}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}