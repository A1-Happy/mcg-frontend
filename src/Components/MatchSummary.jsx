import React, { useEffect } from "react";
import { useState } from "react";
import { getSelfStats, getOpponentStats } from "./ChaserPage";
import AxiosInstance from "./AxiosInstance";
import { useNavigate } from "react-router-dom";

const getTopPlayers = async (id, team) => {
  const results = await AxiosInstance.post("/api/getTopPlayers", {
    matchId: id,
    team,
  });
  console.log(results.data);
  return results.data;
};

const getMatchResult = async (matchId) => {
  const results = await AxiosInstance.post("/api/getMatchResult", { matchId });
  return results.data;
};

export default function MatchSummary({ id, team, matchEnded, setShowSummary }) {
  const navigate = useNavigate();
  const getStats = async () => {
    setSelf(await getSelfStats(id, team));
    setOpponent(await getOpponentStats(id, team));
    const selfTopPlayers = await getTopPlayers(id, team);
    setSelfBestBatsmen(selfTopPlayers.topBatsmen);
    setSelfBestBowlers(selfTopPlayers.topBowlers);

    const opponentTopPlayers = await getTopPlayers(
      id,
      team === "team1" ? "team2" : "team1"
    );
    setOpponentBestBatsmen(opponentTopPlayers.topBatsmen);
    setOpponentBestBowlers(opponentTopPlayers.topBowlers);

    setResult(await getMatchResult(id));
  };
  useEffect(() => {
    getStats();
  }, []);
  const [result, setResult] = useState("");
  const [self, setSelf] = useState({});
  const [opponent, setOpponent] = useState({});
  const [selfBestBatsmen, setSelfBestBatsmen] = useState([]);
  const [opponentBestBatsmen, setOpponentBestBatsmen] = useState([]);
  const [selfBestBowlers, setSelfBestBowlers] = useState([]);
  const [opponentBestBowlers, setOpponentBestBowlers] = useState([]);

  const startAnotherGame = async () => {
    navigate("/");
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <h2 style={{ marginBottom: 0 }}>Match summary</h2>
      <h4>{result ? result : ""}</h4>
      <div
        className="card2"
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          width: "100%",
        }}
      >
        <h4 style={{ flex: 1 }}>
          {self.teamName} {self.score}/{self.wickets} ({self.oversTaken}/
          {self.totalOvers})
        </h4>
        <h4 style={{ flex: 1 }}>
          {opponent.teamName} {opponent.score}/{opponent.wickets} (
          {opponent.oversTaken}/{opponent.totalOvers})
        </h4>
      </div>
      <h4>Top performers</h4>
      <div className="card2" style={{ marginBottom: 20, padding: 20 }}>
        <h5 style={{ marginBottom: 10, marginTop: 0 }}>{self.teamName}</h5>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <div style={{ flex: 1 }}>
            {selfBestBatsmen.map((batsman) => (
              <div key={batsman.playerName}>
                {batsman.playerName}
                {!batsman.isOut ? "*" : ""}: {batsman.score} ({batsman.balls}{" "}
                balls)
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            {selfBestBowlers.map((bowler) => (
              <div key={bowler.playerName}>
                {bowler.playerName}: {bowler.wicketsTaken}/{bowler.runsGiven} (
                {bowler.oversBowled % 1 === 0
                  ? parseInt(bowler.oversBowled)
                  : bowler.oversBowled}
                )
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card2" style={{ padding: 20 }}>
        <h5 style={{ marginBottom: 10, marginTop: 0 }}>{opponent.teamName}</h5>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <div style={{ flex: 1 }}>
            {opponentBestBatsmen.map((batsman) => (
              <div key={batsman.playerName}>
                {batsman.playerName}
                {!batsman.isOut ? "*" : ""}: {batsman.score} ({batsman.balls}{" "}
                balls)
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            {opponentBestBowlers.map((bowler) => (
              <div key={bowler.playerName}>
                {bowler.playerName}: {bowler.wicketsTaken}/{bowler.runsGiven} (
                {bowler.oversBowled % 1 === 0
                  ? parseInt(bowler.oversBowled)
                  : bowler.oversBowled}
                )
              </div>
            ))}
          </div>
        </div>
      </div>
      {matchEnded ? (
        <div>
          <div style={{ marginBottom: 10 }}></div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <button
              className="button"
              style={{ width: 200 }}
              onClick={startAnotherGame}
            >
              Start another game
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 10 }}></div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <button
              className="button"
              style={{ width: 200 }}
              onClick={() => {
                setShowSummary(false);
              }}
            >
              Go back to match
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
