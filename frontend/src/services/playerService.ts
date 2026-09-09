import api from "./api";

// Player data structure
export type Player = {
  _id: string;
  playerId: string;
  playerName: string;
  matchId: string;
  createdAt: string;
  updatedAt: string;
};

// Get all players
export const getPlayers = async (): Promise<Player[]> => {
  const response = await api.get("/players");

  return response.data.data;
};

// Create a new player
export const createPlayer = async (
  playerName: string,
  matchId: string
): Promise<Player> => {
  const response = await api.post("/players", {
    playerName,
    matchId,
  });

  return response.data.data;
};