import React, { useState, useEffect } from "react";
import AxiosInstance from "./AxiosInstance";

const BowlerSelector = ({ id, team, getShowSelectBowler }) => {
  const [bowlerData, setBowlerData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await AxiosInstance.post("/api/getBowlers", {
        id,
        team,
      });
      const players = response.data;

      // Add additional properties to the players data for rendering
      const updatedPlayers = players.map((player) => ({
        ...player,
        isDisabled: player.isBowler === 1,
      }));

      setBowlerData(updatedPlayers);
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBowlerSelection = (id, team, bowlerId) => {
    const selectedBowler = bowlerData.find((bowler) => bowler.id === bowlerId);
    if (selectedBowler) {
      console.log("Selected bowler:", selectedBowler);

      // Make a post request to the backend using AxiosInstance
      AxiosInstance.post("/api/saveBowler", { id, team, bowlerId })
        .then((response) => {
          const success = response.data.success;
          console.log("Success:", success);
          // Perform any additional actions based on the response
          fetchData();
          if (success) {
            getShowSelectBowler(false);
          }
        })
        .catch((error) => {
          console.error("Error saving bowler:", error);
          // Handle the error
        });
    }
  };

  return (
    <div>
      <h3>Choose a Bowler:</h3>
      {bowlerData.map((bowler) => (
        <div style={{ margin: 5 }} key={bowler.id}>
          <button
            onClick={() => handleBowlerSelection(id, team, bowler.id)}
            disabled={bowler.isDisabled}
          >
            {bowler.playerName}
            <div>
              Runs Given: {bowler.runsGiven}, Wickets Taken:{" "}
              {bowler.wicketsTaken}, Overs: {bowler.overs}
            </div>
          </button>
        </div>
      ))}
    </div>
  );
};

export default BowlerSelector;
