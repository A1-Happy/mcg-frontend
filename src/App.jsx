import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useSearchParams,
} from "react-router-dom";
import { useState } from "react";
import "./App.css";
import HostDashboard from "./Components/HostDashboard";
import Home from "./Components/Home";
import Teams from "./Components/Teams";
import Toss from "./Components/Toss";
import BatterPage from "./Components/BatterPage";
import BowlerPage from "./Components/BowlerPage";
import ResultPage from "./Components/Results";
import JoinGame from "./Components/JoinGame";
import OTeams from "./Components/OTeams";
import TossWinner from "./Components/TossWinner";
import TossLoser from "./Components/TossLoser";
import PlayerSelector from "./Components/PlayerSelector";
import ChaserPage from "./Components/chaserPage";

import { useEffect } from "react";
import DefenderPage from "./Components/DefenderPage";
import MatchSummary from "./Components/MatchSummary";

function App() {
  const [id, setId] = useState(parseInt(localStorage.getItem("id") || "-1"));
  const [opponentTeamName, setOpponentTeamName] = useState(
    localStorage.getItem("opponentTeamName") || "Waiting for opponent..."
  );
  const [team, setTeam] = useState(localStorage.getItem("team") || "");
  const [isCaller, setIsCaller] = useState(
    localStorage.getItem("isCaller") === "true" || false
  );

  useEffect(() => {
    localStorage.setItem("id", id);
  }, [id]);

  useEffect(() => {
    localStorage.setItem("opponentTeamName", opponentTeamName);
  }, [opponentTeamName]);

  useEffect(() => {
    localStorage.setItem("team", team);
  }, [team]);

  useEffect(() => {
    localStorage.setItem("isCaller", isCaller.toString());
  }, [isCaller]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/summary"
          element={<MatchSummary id={id} team={team} matchEnded={true} />}
        />

        <Route
          path="/defendTarget"
          element={<DefenderPage id={id} team={team} />}
        />
        <Route
          path="/chaseTarget"
          element={<ChaserPage id={id} team={team} />}
        />
        <Route path="/tmp" element={<PlayerSelector id={id} team={team} />} />
        <Route
          path="/bowling"
          element={
            <BowlerPage
              id={id}
              team={team}
              opponentTeamName={opponentTeamName}
            />
          }
        />
        <Route path="/batting" element={<BatterPage id={id} team={team} />} />
        <Route
          path="/toss-won"
          element={<TossWinner isCaller={isCaller} id={id} team={team} />}
        />
        <Route
          path="/toss-lost"
          element={
            <TossLoser
              isCaller={isCaller}
              opponentTeamName={opponentTeamName}
              team={team}
              id={id}
            />
          }
        />
        <Route
          path="/host-game"
          element={
            <HostDashboard
              setId={setId}
              setIsCaller={setIsCaller}
              setTeam={setTeam}
            />
          }
        />
        <Route
          path="/join-game"
          element={
            <JoinGame
              setId={setId}
              setOpponentTeamName={setOpponentTeamName}
              setIsCaller={setIsCaller}
              setTeam={setTeam}
            />
          }
        />
        <Route path="/home" Component={Home} />
        <Route
          path="/teams"
          element={
            <Teams
              id={id}
              opponentTeamName={opponentTeamName}
              setOpponentTeamName={setOpponentTeamName}
            />
          }
        />
        <Route
          path="/o-teams"
          element={<OTeams id={id} opponentTeamName={opponentTeamName} />}
        />
        <Route
          path="/toss"
          element={
            <Toss
              id={id}
              opponentTeamName={opponentTeamName}
              isCaller={isCaller}
              team={team}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
