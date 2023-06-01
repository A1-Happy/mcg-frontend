import { useEffect, useState } from "react";
import "../App.css";
import AxiosInstance from "./AxiosInstance";
import { useNavigate } from "react-router-dom";

function Teams({ id, setOpponentTeamName }) {
  const navigate = useNavigate();
  const [opponent, setOpponent] = useState("Waiting for opponent...");
  const [teamName, setTeamName] = useState(() => {
    const storedTeamName = localStorage.getItem("selfTeamName");
    return storedTeamName || "";
  });
  const [showStartButton, setShowStartButton] = useState(false);

  const refreshOpponentTeam = async () => {
    console.log("Refreshing opponent team...");
    try {
      const response = await AxiosInstance.post("/api/checkOpponent", { id });

      const { opponentTeamName } = response.data;

      if (opponentTeamName) {
        setOpponentTeamName(opponentTeamName);
        setOpponent(opponentTeamName);
        setShowStartButton(true);
      } else {
        setShowStartButton(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!showStartButton) {
      refreshOpponentTeam();
      const refreshInterval = setInterval(() => {
        refreshOpponentTeam();
      }, 1000);
      return () => {
        clearInterval(refreshInterval);
      };
    } // Clean up the interval on component unmount
  }, [showStartButton]);

  const handleStartGame = () => {
    // Handle start game logic here
    console.log("Game started!");
    navigate("/toss");
  };

  return (
    <div className="teams-container">
      <h3>Match ID: {id}</h3>
      <div className="team-card">
        <h3>{teamName}</h3>
      </div>
      <div className="vs-card">
        <h2>VS</h2>
      </div>
      <div className="team-card">
        <h3>{opponent}</h3>
      </div>
      {showStartButton && (
        <button onClick={handleStartGame} className="start-button">
          Start Game
        </button>
      )}
    </div>
  );
}

export default Teams;
