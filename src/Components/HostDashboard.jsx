import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import AxiosInstance from "./AxiosInstance";
import { useNavigate } from "react-router-dom";

function HostDashboard({ setId, setIsCaller, setTeam }) {
  const navigate = useNavigate();
  const [overs, setOvers] = useState(() => {
    const storedOvers = localStorage.getItem("overs");
    return storedOvers ? parseInt(storedOvers) : 0;
  });

  const [teamName, setTeamName] = useState(() => {
    const storedTeamName = localStorage.getItem("teamName");
    return storedTeamName || "Rajasthan Royals";
  });

  const [playerNames, setPlayerNames] = useState(() => {
    const storedPlayerNames = JSON.parse(localStorage.getItem("playerNames"));

    if (storedPlayerNames && storedPlayerNames.length !== 0) {
      return storedPlayerNames;
    } else {
      const defaultPlayerNames = [
        "Sanju Samson",
        "Ben Stokes",
        "Jos Buttler",
        "Riyan Parag",
        "Liam Livingstone",
        "Chris Morris",
        "Shivam Dube",
        "Rahul Tewatia",
        "Jaydev Unadkat",
        "Mustafizur Rahman",
        "Chetan Sakariya",
      ];

      localStorage.setItem("playerNames", JSON.stringify(defaultPlayerNames));
      return defaultPlayerNames;
    }
  });

  const handleOversChange = (event) => {
    const updatedOvers = parseInt(event.target.value);
    setOvers(updatedOvers);
    localStorage.setItem("overs", updatedOvers.toString());
  };

  const handleTeamNameChange = (event) => {
    const updatedTeamName = event.target.value;
    setTeamName(updatedTeamName);
    localStorage.setItem("teamName", updatedTeamName);
  };

  const handlePlayerNameChange = (event, index) => {
    const updatedPlayerNames = [...playerNames];
    updatedPlayerNames[index] = event.target.value;
    setPlayerNames(updatedPlayerNames);
    localStorage.setItem("playerNames", JSON.stringify(updatedPlayerNames));
  };

  const handleSubmit = async (event) => {
    localStorage.setItem("selfTeamName", teamName);
    event.preventDefault();

    try {
      const payload = {
        overs,
        teamName,
        playerNames,
      };

      const response = await AxiosInstance.post("/api/hostNewGame", payload);

      const { id, tossCaller } = response.data;
      setId(id);
      setIsCaller(tossCaller);
      setTeam("team1");
      navigate(`/teams`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="host-dashboard">
      <h2>Customize Your Cricket Match</h2>
      <form onSubmit={handleSubmit}>
        <div className="card">
          <label htmlFor="overs">Number of Overs: </label>
          <input
            type="number"
            id="overs"
            value={overs}
            onChange={handleOversChange}
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

        <button type="submit" onSubmit={handleSubmit}>
          Start Game
        </button>
      </form>
    </div>
  );
}

export default HostDashboard;
