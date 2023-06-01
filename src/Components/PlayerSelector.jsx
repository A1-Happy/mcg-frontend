import React, { useEffect, useState } from "react";
import AxiosInstance from "./AxiosInstance";

const PlayerSelector = ({ id, team, getShowBatsmanSelector }) => {
  const [players, setPlayers] = useState([]);

  const fetchPlayers = async () => {
    try {
      const response = await AxiosInstance.post("/api/getPlayers", {
        id,
        team,
      });
      const { playersPlayed, playersNotPlayed } = response.data;
      setPlayers([...playersPlayed, ...playersNotPlayed]);
    } catch (error) {
      console.log("Error fetching players:", error);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handlePlayerSelection = async (playerId) => {
    try {
      const response = await AxiosInstance.post("/api/selectPlayer", {
        id,
        team,
        playerId,
      });
      const { success } = response.data;
      if (success) {
        getShowBatsmanSelector();
        fetchPlayers();
      } else {
        console.error("Already players are assigned.");
      }
    } catch (error) {
      console.log("Error selecting player:", error);
    }
  };

  return (
    <div>
      <h3>Choose a Batsman:</h3>
      {players.map((player) => (
        <div style={{ margin: 5 }} key={player.id}>
          <button
            onClick={() => handlePlayerSelection(player.id)}
            disabled={player.score !== undefined}
          >
            <div>{player.name}</div>
            {player.score !== undefined && (
              <span>
                {player.score} ({player.ballsTaken})
              </span>
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PlayerSelector;
