"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  RefreshCw,
  X,
  Search,
  Users,
  Gamepad2,
} from "lucide-react";

import {
  getPlayers,
  createPlayer,
  Player,
} from "@/services/playerService";

import {
  getMatches,
  Match,
} from "@/services/matchService";

export default function PlayersPage() {
  // Store players and matches fetched from the backend.
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  // Manage loading and create states.
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Controls the Create Player modal.
  const [showModal, setShowModal] = useState(false);

  // Store form values.
  const [playerName, setPlayerName] = useState("");
  const [matchId, setMatchId] = useState("");

  // Store search text.
  const [search, setSearch] = useState("");

  // Store success and error messages.
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // ==========================================
  // GET PLAYERS
  // ==========================================

  // Fetch all players from the backend and update the table.
  const loadPlayers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPlayers();

      setPlayers(data);
    } catch (error) {
      console.error("Get players error:", error);

      setError(
        "Unable to load players. Please check the backend server."
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // GET MATCHES
  // Used for Match ID dropdown
  // ==========================================

  // Fetch matches so the user can select an existing match
  // while creating a player.
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

  // Load players and matches when the page opens.
  useEffect(() => {
    loadPlayers();
    loadMatches();
  }, []);


  // ==========================================
  // CREATE PLAYER
  // ==========================================

  // Handle Create Player form submission.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = playerName.trim();

    // Validate Player Name.
    if (!name) {
      setError("Player name is required.");
      return;
    }

    // Validate Match selection.
    if (!matchId) {
      setError("Please select a match.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      // Send player name and match ID to the backend.
      // Backend automatically generates the Player ID.
      await createPlayer(name, matchId);

      // Clear form after successful creation.
      setPlayerName("");
      setMatchId("");

      // Close the modal.
      setShowModal(false);

      setSuccess("Player created successfully.");

      // Reload players so the new player appears in the table.
      await loadPlayers();

      // Remove success message after 3 seconds.
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Create player error:", error);

      setError(
        "Unable to create player. Please try again."
      );
    } finally {
      setCreating(false);
    }
  };


  // ==========================================
  // SEARCH
  // ==========================================

  // Filter players by Player ID, Player Name or Match ID.
  const filteredPlayers = players.filter((player) => {
    const value = search.toLowerCase();

    return (
      player.playerId.toLowerCase().includes(value) ||
      player.playerName.toLowerCase().includes(value) ||
      player.matchId.toLowerCase().includes(value)
    );
  });


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
              Master Data
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Players
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage players
            </p>
          </div>


          {/* Open the Create Player modal and refresh matches
              so the dropdown contains the latest match data. */}
          <button
            onClick={() => {
              setShowModal(true);
              setError("");
              loadMatches();
            }}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={18} />
            Create Player
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
            STATS
        ==================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* Total Players */}

          <div className="rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Players
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {players.length}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100">

                <Users
                  size={22}
                  className="text-slate-700"
                />

              </div>

            </div>

          </div>


          {/* Total Matches */}

          <div className="rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Matches
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-600">
                  {matches.length}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">

                <Gamepad2
                  size={22}
                  className="text-blue-600"
                />

              </div>

            </div>

          </div>

        </div>


        {/* ====================================
            TABLE
        ==================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

          {/* Table Header */}

          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

            <div>

              <h2 className="text-base font-semibold text-slate-900">
                Player List
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Player Master Records
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
                  placeholder="Search player..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-56 rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-900"
                />

              </div>


              {/* Refresh the player list from the backend. */}

              <button
                onClick={loadPlayers}
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


          {/* Table */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr className="border-b border-slate-200 text-left">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Player ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Player Name
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Match ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Created
                  </th>

                </tr>

              </thead>


              <tbody>

                {/* Show a loading row while players are being fetched. */}

                {loading && (

                  <tr>

                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >

                      <div className="flex flex-col items-center gap-3">

                        <RefreshCw
                          size={24}
                          className="animate-spin text-slate-400"
                        />

                        Loading players...

                      </div>

                    </td>

                  </tr>

                )}


                {/* Show an empty state when no players match the search. */}

                {!loading &&
                  filteredPlayers.length === 0 && (

                    <tr>

                      <td
                        colSpan={4}
                        className="px-6 py-14 text-center"
                      >

                        <Users
                          size={40}
                          className="mx-auto mb-3 text-slate-300"
                        />

                        <p className="font-medium text-slate-600">
                          No players found
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Create your first player
                        </p>

                      </td>

                    </tr>

                  )}


                {/* Render each filtered player as a table row. */}

                {!loading &&
                  filteredPlayers.map((player) => (

                    <tr
                      key={player._id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >

                      {/* Player ID */}

                      <td className="px-6 py-4">

                        <span className="rounded-md bg-slate-100 px-3 py-1 font-mono text-sm font-semibold text-slate-700">
                          {player.playerId}
                        </span>

                      </td>


                      {/* Player Name */}

                      <td className="px-6 py-4">

                        <p className="text-sm font-semibold text-slate-900">
                          {player.playerName}
                        </p>

                      </td>


                      {/* Match ID */}

                      <td className="px-6 py-4">

                        <span className="rounded-md bg-blue-50 px-3 py-1 font-mono text-sm font-semibold text-blue-700">
                          {player.matchId}
                        </span>

                      </td>


                      {/* Created */}

                      <td className="px-6 py-4 text-sm text-slate-500">

                        {new Date(
                          player.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}

                      </td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>


      {/* ======================================
          CREATE PLAYER MODAL
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

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">

                  <Users
                    size={20}
                    className="text-slate-700"
                  />

                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Create Player
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add a new player to master
                  </p>

                </div>

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
              className="space-y-6 p-6"
            >

              {/* Player ID is generated automatically by the backend. */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Player ID
                </label>

                <input
                  type="text"
                  value="Auto Generated"
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Player ID will be generated automatically.
                </p>

              </div>


              {/* Player Name */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">

                  Player Name

                  <span className="ml-1 text-red-500">
                    *
                  </span>

                </label>

                <input
                  type="text"
                  placeholder="Enter player name"
                  value={playerName}

                  // Update Player Name state when the user types.
                  onChange={(e) => {
                    setPlayerName(e.target.value);
                    setError("");
                  }}

                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  autoFocus
                />

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

                  // Store the selected Match ID.
                  onChange={(e) => {
                    setMatchId(e.target.value);
                    setError("");
                  }}

                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                >

                  <option value="">
                    Select Match
                  </option>


                  {/* Create one dropdown option for every match
                      received from the backend. */}

                  {matches.map((match) => (

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

                {/* Cancel and clear the form. */}

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setPlayerName("");
                    setMatchId("");
                  }}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>


                {/* Submit the form to create a new player. */}

                <button
                  type="submit"

                  // Disable until required fields are filled
                  // or while the API request is running.
                  disabled={
                    creating ||
                    !playerName.trim() ||
                    !matchId
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
                    ? "Creating..."
                    : "Create Player"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}