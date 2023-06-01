import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function ResultPage() {
  const [winnerTeam] = useState("Team A");
  const [winnerResult] = useState("Won by 4 runs");
  const [loserTeam] = useState("Team B");

  return (
    <div className="result-page">
      <h2>Match Result</h2>
      <div className="winner-info">
        <h3>{winnerTeam}</h3>
        <p>{winnerResult}</p>
      </div>
      <div className="loser-info">
        <h4>Runner-up: {loserTeam}</h4>
      </div>

      <Link to="/home">Play Another Game</Link>
    </div>
  );
}

export default ResultPage;
