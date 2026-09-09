import api from "./api";

// Tournament data structure
export type Tournament = {
  _id: string;
  tournamentId: string;
  tournamentName: string;
  createdAt: string;
  updatedAt: string;
};

// Get all tournaments
export const getTournaments = async (): Promise<Tournament[]> => {
  const response = await api.get("/tournaments");

  return response.data.data;
};

// Create a new tournament
export const createTournament = async (
  tournamentName: string
): Promise<Tournament> => {
  const response = await api.post("/tournaments", {
    tournamentName,
  });

  return response.data.data;
};