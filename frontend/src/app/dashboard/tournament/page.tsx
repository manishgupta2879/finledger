
"use client";

// Import React hooks for managing component state and running code when the page loads.
import { useEffect, useState } from "react";

// Import Lucide icons used throughout the page.
import {
  Plus,
  RefreshCw,
  X,
  Trophy,
  Search,
} from "lucide-react";

// Import API functions and the Tournament Type from the tournament service.
import {
  getTournaments,
  createTournament,
  Tournament,
} from "@/services/tournamentService";

export default function TournamentsPage() {

  // Stores the list of tournaments received from the backend.
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  // Indicates whether tournament data is currently being loaded.
  const [loading, setLoading] = useState(true);

  // Indicates whether a new tournament is currently being created.
  const [creating, setCreating] = useState(false);

  // Controls whether the Create Tournament modal is visible.
  const [showModal, setShowModal] = useState(false);

  // Stores the value entered in the Tournament Name input.
  const [tournamentName, setTournamentName] = useState("");

  // Stores the search text entered by the user.
  const [search, setSearch] = useState("");

  // Stores error messages that should be displayed to the user.
  const [error, setError] = useState("");

  // Stores success messages that should be displayed to the user.
  const [success, setSuccess] = useState("");


  // ==========================================
  // GET TOURNAMENTS
  // ==========================================

  // Fetch all tournaments from the backend.
  const loadTournaments = async () => {
    try {

      // Show loading state while API request is running.
      setLoading(true);

      // Clear any previous error message.
      setError("");

      // Call GET /api/tournaments through the service.
      const data = await getTournaments();

      // Store the returned tournaments in React state.
      setTournaments(data);

    } catch (error) {

      

      
      setError(
        "Unable to load tournaments. Please check the backend server."
      );

    } finally {

      // Stop the loading state after the API request completes.
      setLoading(false);
    }
  };


  // ==========================================
  // LOAD DATA ON PAGE LOAD
  // ==========================================

  // Run loadTournaments once when the page is opened.
  useEffect(() => {
    loadTournaments();
  }, []);


  // ==========================================
  // CREATE TOURNAMENT
  // ==========================================

 
  const handleSubmit = async (e: React.FormEvent) => {

    // Prevent the browser from refreshing the page after form submission.
    e.preventDefault();

    // Remove unnecessary spaces from the tournament name.
    const name = tournamentName.trim();

    // Validate that the Tournament Name is not empty.
    if (!name) {
      setError("Tournament name is required.");
      return;
    }

    try {

      // Show creating/loading state on the submit button.
      setCreating(true);

      // Clear old error and success messages.
      setError("");
      setSuccess("");

      // Send the tournament name to the backend.
      // Backend will automatically generate the Tournament ID.
      await createTournament(name);

      
      setTournamentName("");

    
      setShowModal(false);

      
      setSuccess("Tournament created successfully.");

      // Fetch the latest tournament list from the backend.
      
      await loadTournaments();

      // Automatically remove the success message after 3 seconds.
      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (error) {

      // Print the actual error for debugging.
      console.error("Create tournament error:", error);

      // Show a user-friendly error message.
      setError(
        "Unable to create tournament. Please try again."
      );

    } finally {

      // Stop the creating/loading state.
      setCreating(false);
    }
  };


  // ==========================================
  // SEARCH
  // ==========================================

  // Filter tournaments based on the search input.
  // User can search by Tournament ID or Tournament Name.
  const filteredTournaments = tournaments.filter((tournament) => {

    // Convert search text to lowercase for case-insensitive searching.
    const value = search.toLowerCase();

    // Check whether Tournament ID OR Tournament Name contains the search text.
    return (
      tournament.tournamentId
        .toLowerCase()
        .includes(value) ||
      tournament.tournamentName
        .toLowerCase()
        .includes(value)
    );
  });


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ======================================
          HEADER
          Displays page title and Create button.
      ====================================== */}

      <div className="border-b border-slate-200 bg-white px-8 py-5">

        <div className="flex items-center justify-between">

          {/* Page title and description */}
          <div>

            <p className="text-sm text-slate-500">
              Master Data
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Tournaments
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage tournaments
            </p>

          </div>


          {/* Opens the Create Tournament modal */}
          <button
            onClick={() => {

              // Open the modal.
              setShowModal(true);

              // Clear any previous error.
              setError("");
            }}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >

            <Plus size={18} />

            Create Tournament

          </button>

        </div>

      </div>


      {/* ======================================
          CONTENT
      ====================================== */}

      <div className="p-8">

        {/* ====================================
            SUCCESS MESSAGE
            Shows after successful tournament creation.
        ==================================== */}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}


        {/* ====================================
            ERROR MESSAGE
            Shows API or validation errors.
        ==================================== */}

        {error && (
          <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">

            <span>{error}</span>

            {/* Closes the error message */}
            <button
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700"
            >
              <X size={18} />
            </button>

          </div>
        )}


        {/* ====================================
            STATS
            Displays basic tournament statistics.
        ==================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* Total Tournaments Card */}

          <div className="rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Tournaments
                </p>

                {/* Number of tournaments currently stored in state */}
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {tournaments.length}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100">

                <Trophy
                  size={22}
                  className="text-slate-700"
                />

              </div>

            </div>

          </div>


          {/* Master Records Card */}

          <div className="rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Master Records
                </p>

                {/* Currently shows the same tournament count */}
                <p className="mt-2 text-2xl font-bold text-blue-600">
                  {tournaments.length}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">

                <span className="text-lg font-bold text-blue-600">
                  #
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* ====================================
            TABLE CARD
            Contains search, refresh and tournament table.
        ==================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

          {/* Table Header */}

          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

            <div>

              <h2 className="text-base font-semibold text-slate-900">
                Tournament List
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Tournament Master Records
              </p>

            </div>


            <div className="flex items-center gap-3">

              {/* ==================================
                  SEARCH
                  Filters the table by ID or Name.
              ================================== */}

              <div className="relative">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search tournament..."
                  value={search}

                  // Update search state whenever user types.
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }

                  className="w-56 rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-900"
                />

              </div>


              {/* ==================================
                  REFRESH
                  Fetches latest tournament data from backend.
              ================================== */}

              <button
                onClick={loadTournaments}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >

                <RefreshCw
                  size={16}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh

              </button>

            </div>

          </div>


          {/* ==================================
              TABLE
          ================================== */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr className="border-b border-slate-200 text-left">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tournament ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tournament Name
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Created
                  </th>

                </tr>

              </thead>


              <tbody>

                {/* ==================================
                    LOADING STATE
                ================================== */}

                {loading && (

                  <tr>

                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >

                      <div className="flex flex-col items-center gap-3">

                        <RefreshCw
                          size={24}
                          className="animate-spin text-slate-400"
                        />

                        Loading tournaments...

                      </div>

                    </td>

                  </tr>

                )}


                {/* ==================================
                    EMPTY STATE
                    Shows when there are no matching tournaments.
                ================================== */}

                {!loading &&
                  filteredTournaments.length === 0 && (

                    <tr>

                      <td
                        colSpan={3}
                        className="px-6 py-14 text-center"
                      >

                        <Trophy
                          size={40}
                          className="mx-auto mb-3 text-slate-300"
                        />

                        <p className="font-medium text-slate-600">
                          No tournaments found
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Create your first tournament
                        </p>

                      </td>

                    </tr>

                  )}


                {/* ==================================
                    DATA
                    Displays filtered tournaments in table rows.
                ================================== */}

                {!loading &&
                  filteredTournaments.map(
                    (tournament) => (

                      <tr
                        key={tournament._id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >

                        {/* Tournament ID */}

                        <td className="px-6 py-4">

                          <span className="rounded-md bg-slate-100 px-3 py-1 font-mono text-sm font-semibold text-slate-700">
                            {tournament.tournamentId}
                          </span>

                        </td>


                        {/* Tournament Name */}

                        <td className="px-6 py-4">

                          <p className="text-sm font-semibold text-slate-900">
                            {tournament.tournamentName}
                          </p>

                        </td>


                        {/* Created Date */}

                        <td className="px-6 py-4 text-sm text-slate-500">

                          {/* Convert backend ISO date into readable Indian date format */}
                          {new Date(
                            tournament.createdAt
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
          CREATE TOURNAMENT MODAL
          This modal opens when the user clicks
          "Create Tournament".
      ====================================== */}

      {showModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"

          // Close modal when clicking outside the modal box.
          onMouseDown={(e) => {

            if (e.target === e.currentTarget) {
              setShowModal(false);
            }

          }}
        >

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* ==================================
                MODAL HEADER
            ================================== */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">

                    <Trophy
                      size={20}
                      className="text-slate-700"
                    />

                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-slate-900">
                      Create Tournament
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Add a new tournament to master
                    </p>

                  </div>

                </div>

              </div>


              {/* Close modal button */}

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >

                <X size={20} />

              </button>

            </div>


            {/* ==================================
                FORM
            ================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >

              {/* ==================================
                  TOURNAMENT ID
                  ID is generated automatically by backend.
              ================================== */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Tournament ID
                </label>

                <input
                  type="text"
                  value="Auto Generated"
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Tournament ID will be generated automatically.
                </p>

              </div>


              {/* ==================================
                  TOURNAMENT NAME
                  User enters the tournament name here.
              ================================== */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">

                  Tournament Name

                  <span className="ml-1 text-red-500">
                    *
                  </span>

                </label>

                <input
                  type="text"
                  placeholder="Enter tournament name"

                  // Input value comes from tournamentName state.
                  value={tournamentName}

                  // Update state whenever user types.
                  onChange={(e) => {

                    setTournamentName(
                      e.target.value
                    );

                    // Clear previous error while typing.
                    setError("");
                  }}

                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"

                  // Automatically focus this field when modal opens.
                  autoFocus
                />

              </div>


              {/* ==================================
                  FORM BUTTONS
              ================================== */}

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                {/* Cancel button */}

                <button
                  type="button"

                  onClick={() => {

                    // Close modal.
                    setShowModal(false);

                    // Clear the input.
                    setTournamentName("");
                  }}

                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >

                  Cancel

                </button>


                {/* Create button */}

                <button
                  type="submit"

                  // Disable button while creating or when name is empty.
                  disabled={
                    creating ||
                    !tournamentName.trim()
                  }

                  className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {/* Show spinner while API request is running. */}

                  {creating && (
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {/* Change button text while creating. */}

                  {creating
                    ? "Creating..."
                    : "Create Tournament"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

