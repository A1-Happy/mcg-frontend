import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import AxiosInstance from "./AxiosInstance";
import { useNavigate } from "react-router-dom";

function JoinGame({ setOpponentTeamName, setId, setIsCaller, setTeam }) {
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [matchId, setMatchId] = useState(() => {
    const storedMatchId = localStorage.getItem("matchId");
    return storedMatchId || "";
  });

  const [teamName, setTeamName] = useState(() => {
    const storedTeamName = localStorage.getItem("joinTeamName");
    return storedTeamName || "Mumbai Indians";
  });

  const [playerNames, setPlayerNames] = useState(() => {
    const storedPlayerNames = JSON.parse(
      localStorage.getItem("joinPlayerNames")
    );

    if (storedPlayerNames && storedPlayerNames.length !== 0) {
      return storedPlayerNames;
    } else {
      const defaultPlayerNames = [
        "Rohit Sharma",
        "Quinton de Kock",
        "Suryakumar Yadav",
        "Ishan Kishan",
        "Hardik Pandya",
        "Kieron Pollard",
        "Krunal Pandya",
        "Nathan Coulter-Nile",
        "Jasprit Bumrah",
        "Trent Boult",
        "Rahul Chahar",
      ];

      localStorage.setItem(
        "joinPlayerNames",
        JSON.stringify(defaultPlayerNames)
      );
      return defaultPlayerNames;
    }
  });

  const handleMatchIdChange = (event) => {
    const updatedMatchId = event.target.value;
    setMatchId(updatedMatchId);
    localStorage.setItem("matchId", updatedMatchId);
  };

  const handleTeamNameChange = (event) => {
    const updatedTeamName = event.target.value;
    setTeamName(updatedTeamName);
    localStorage.setItem("joinTeamName", updatedTeamName);
  };

  const handlePlayerNameChange = (event, index) => {
    const updatedPlayerNames = [...playerNames];
    updatedPlayerNames[index] = event.target.value;
    setPlayerNames(updatedPlayerNames);
    localStorage.setItem("joinPlayerNames", JSON.stringify(updatedPlayerNames));
  };

  const handleSubmit = async (event) => {
    localStorage.setItem("joinTeamName", teamName);
    event.preventDefault();

    try {
      const payload = {
        matchId,
        teamName,
        playerNames,
      };

      const response = await AxiosInstance.post("/api/joinGame", payload);

      const { opponentTeamName, success, message, tossCaller } = response.data;
      if (success) {
        setId(localStorage.getItem("matchId"));
        setIsCaller(tossCaller);
        setOpponentTeamName(opponentTeamName);
        setTeam("team2");
        navigate(`/o-teams`);
      } else {
        setStatus(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="join-game">
      <h2>Join an Existing Cricket Match</h2>
      <form onSubmit={handleSubmit}>
        <div className="card">
          <label htmlFor="matchId">Match ID: </label>
          <input
            type="text"
            id="matchId"
            value={matchId}
            onChange={handleMatchIdChange}
          />
        </div>

        <div className="card">
          <label>Team Name: </label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={handleTeamNameChange}
          />
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <label>Player Names:</label>
          {playerNames.map((playerName, index) => (
            <div key={index}>
              <input
                type="text"
                value={playerName}
                onChange={(event) => handlePlayerNameChange(event, index)}
              />
            </div>
          ))}
        </div>

        <button style={{ marginBottom: status ? 10 : 0 }} type="submit">
          Join Game
        </button>

        <div>{status}</div>
      </form>
    </div>
  );
}

export default JoinGame;
