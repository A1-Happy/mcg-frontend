import { useEffect, useState } from "react";
import AxiosInstance from "./AxiosInstance";
import PlayerSelector from "./PlayerSelector";
import { handleRunsSelection } from "./BatterPage";
import LastSixBalls from "./LastSixBalls";

import { useNavigate } from "react-router-dom";
import { startInterval } from "../utils";
import MatchSummary from "./MatchSummary";

const showChoiceSelector = async (id, team) => {
  return (
    await AxiosInstance.post("/api/showChoiceSelector", {
      matchId: id,
      team,
    }).then((response) => {
      return response.data;
    })
  ).showChoiceSelector;
};

export const getOpponentStats = async (matchId, team) => {
  return await AxiosInstance.post("/api/getOpponentNameAndScore", {
    matchId,
    team,
  }).then((response) => {
    return response.data;
  });
};

export const getSelfStats = async (matchId, team) => {
  return await AxiosInstance.post("/api/getSelfStats", {
    matchId,
    team,
  }).then((response) => {
    return response.data;
  });
};

export const getBatsmenPlaying = async (matchId) => {
  return await AxiosInstance.post("/api/getBatsmenPlaying", {
    matchId,
  }).then((response) => {
    return response.data;
  });
};

export const getBowlerPlaying = async (matchId) => {
  return await AxiosInstance.post("/api/getBowlerPlaying", {
    matchId,
  }).then((response) => {
    return response.data;
  });
};

export const getTargetAndRemainingBalls = async (matchId) => {
  return await AxiosInstance.post("/api/getTargetAndRemainingBalls", {
    matchId,
  }).then((response) => {
    return response.data;
  });
};

export const checkInnings = async (matchId) => {
  return AxiosInstance.post("/api/checkInnings", { matchId })
    .then((response) => {
      return response.data.innings;
    })
    .catch((e) => {
      console.error(e);
    });
};

export default function ChaserPage({ id, team }) {
  const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [opponentTeamName, setOpponentTeamName] = useState(
    "Waiting for opponent..."
  );
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentWickets, setOpponentWickets] = useState(0);
  const [opponentOversTaken, setOpponentOversTaken] = useState(0);
  const [selfScore, setSelfScore] = useState(0);
  const [selfTeamName, setSelfTeamName] = useState("Getting data...");
  const [selfWickets, setSelfWickets] = useState(0);
  const [selfOversTaken, setSelfOversTaken] = useState(0);
  const [totalOvers, setTotalOvers] = useState(0);
  const [target, setTarget] = useState(0);
  const [remainingBalls, setRemainingBalls] = useState(0);
  const choices = [0, 1, 2, 3, 4, 6];
  const [batsmen, setBatsmen] = useState([
    {
      playerName: "Waiting for batsman...",
      score: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
    },
    {
      playerName: "Waiting for batsman...",
      score: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
    },
  ]);
  const [bowler, setBowler] = useState([
    {
      playerName: "Waiting for bowler...",
      runsGiven: 0,
      oversBowled: 0,
      wicketsTaken: 0,
    },
  ]);

  const allInOne = () => {
    getOpponentStats(id, team).then((opponentStats) => {
      setOpponentTeamName(opponentStats.teamName);
      setOpponentScore(opponentStats.score);
      setOpponentWickets(opponentStats.wickets);
      setOpponentOversTaken(opponentStats.oversTaken);
      setTotalOvers(opponentStats.totalOvers);
    });

    getSelfStats(id, team).then((stats) => {
      setSelfTeamName(stats.teamName);
      setSelfScore(stats.score);
      setSelfWickets(stats.wickets);
      setSelfOversTaken(stats.oversTaken);
      setTotalOvers(stats.totalOvers);
    });

    getBowlerPlaying(id).then((bowler) => {
      setBowler(bowler);
    });

    getTargetAndRemainingBalls(id).then((result) => {
      setTarget(result.target);
      setRemainingBalls(result.remainingBalls);
    });
  };

  const getShowBatsmanSelector = async () => {
    const innings = await checkInnings(id);
    if (innings === 2) {
      navigate("/summary");
      return;
    }

    getBatsmenPlaying(id).then((batsmen) => {
      setBatsmen(batsmen);
      if (batsmen.length !== 2) {
        return;
      } else if (batsmen.length === 2) {
        allInOne();
      }
    });
  };

  useEffect(() => {
    getShowBatsmanSelector();
  }, []);

  useEffect(() => {
    if (bowler.length === 0) {
      const updateBowlerInterval = startInterval(async () => {
        console.log("bowler");
        const newBowler = await getBowlerPlaying(id);
        if (newBowler.length !== 0) {
          setBowler(newBowler);
          clearInterval(updateBowlerInterval);
        }
      }, 1000);
    }
  }, [bowler]);

  useEffect(() => {
    if (!showChoices) {
      const getShowChoicesInterval = startInterval(async () => {
        console.log("showChoices", showChoices);
        const newChoice = await showChoiceSelector(id, team);
        if (newChoice) {
          setShowChoices(true);
          getShowBatsmanSelector();
          clearInterval(getShowChoicesInterval);
        }
      }, 1000);
    }
  }, [showChoices]);

  return (
    <div>
      {!showSummary ? (
        <div>
          {batsmen.length < 2 ? (
            <PlayerSelector
              id={id}
              team={team}
              getShowBatsmanSelector={getShowBatsmanSelector}
            />
          ) : (
            <div>
              <h2>
                {selfTeamName}: {selfScore}/{selfWickets} ({selfOversTaken}/
                {totalOvers})
              </h2>
              <div style={{ marginBottom: 30 }}>
                <h4>Batsmen:</h4>
                {batsmen.map((batsman, index) => (
                  <h4 key={index}>
                    <span style={{ marginRight: 20 }}>
                      {batsman.playerName}
                      {batsman.isStriker ? "*" : ""} ({batsman.score}/
                      {batsman.balls})
                    </span>{" "}
                    Fours: {batsman.fours} Sixes: {batsman.sixes}
                  </h4>
                ))}
              </div>
              <div style={{ marginBottom: 30 }}>
                <h4>Bowler:</h4>
                {bowler.map((bowler, index) => (
                  <h4 key={index}>
                    <span style={{ marginRight: 20 }}>
                      {bowler.playerName} ({bowler.wicketsTaken}/
                      {bowler.runsGiven})
                    </span>{" "}
                    ({bowler.oversBowled})
                  </h4>
                ))}
              </div>

              <div style={{ marginBottom: 30 }}>
                <h4>Target:</h4>
                <h4>
                  {selfTeamName} require {target} runs in {remainingBalls} balls
                  to win.{" "}
                </h4>
                <h5>
                  {opponentTeamName}: {opponentScore}/{opponentWickets} (
                  {opponentOversTaken})
                </h5>
              </div>
              <h4>Try For:</h4>
              <h5>
                Note: Choosing to go for a high score raises the risk of losing
                a wicket.
              </h5>

              {showChoices ? (
                <div className="runs-selection">
                  {choices.map((choice, index) => (
                    <button
                      key={index}
                      className="runs-button"
                      onClick={async () => {
                        await handleRunsSelection(id, team, choice);
                        setShowChoices(false);
                        getShowBatsmanSelector();
                      }}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              ) : (
                "Please wait for your opponent to bowl..."
              )}
            </div>
          )}
          <LastSixBalls id={id} team={team} change={showChoices} />
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
                style={{ minWidth: 200 }}
                onClick={() => {
                  setShowSummary(true);
                }}
              >
                Show match summary
              </button>
            </div>
          </div>
        </div>
      ) : (
        <MatchSummary id={id} team={team} setShowSummary={setShowSummary} />
      )}
    </div>
  );
}
