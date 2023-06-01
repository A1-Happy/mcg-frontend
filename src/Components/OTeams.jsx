import { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

function OTeams({ id, opponentTeamName }) {
  const navigate = useNavigate();
  const [startButton, showStartButton] = useState(false);
  const teamName = localStorage.getItem("joinTeamName") || "Hello";
  useEffect(() => {
    console.log(localStorage.getItem("joinTeamName") || "Hello");
    showStartButton(true);
  }, []);

  const handleStartGame = () => {
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
      <div
        style={{ marginBottom: showStartButton ? 10 : 0 }}
        className="team-card"
      >
        <h3>{opponentTeamName}</h3>
      </div>
      {showStartButton && (
        <button onClick={handleStartGame} className="start-button">
          Start Game
        </button>
      )}
    </div>
  );
}

export default OTeams;
