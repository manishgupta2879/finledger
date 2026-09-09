import api from "./api";

// Match data structure
export type Match = {
  _id: string;
  matchId: string;
  matchName: string;
  tournamentId: string;
  createdAt: string;
  updatedAt: string;
};

// Get all matches
export const getMatches = async (): Promise<Match[]> => {
  const response = await api.get("/matches");

  return response.data.data;
};

// Create a new match
export const createMatch = async (
  matchName: string,
  tournamentId: string
): Promise<Match> => {
  const response = await api.post("/matches", {
    matchName,
    tournamentId,
  });

  return response.data.data;
};