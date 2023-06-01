import { useEffect, useState } from "react";
import "../App.css";
import AxiosInstance from "./AxiosInstance";
import PlayerSelector from "./PlayerSelector";
import { checkInnings } from "./ChaserPage";
import { useNavigate } from "react-router-dom";
import { getBowlerPlaying } from "./ChaserPage";
import { startInterval } from "../utils";
import LastSixBalls from "./LastSixBalls";
import MatchSummary from "./MatchSummary";

export const showChoiceSelector = async (id, team) => {
  return (
    await AxiosInstance.post("/api/showChoiceSelector", {
      matchId: id,
      team,
    }).then((response) => {
      return response.data;
    })
  ).showChoiceSelector;
};

export const handleRunsSelection = async (
  id,
  team,
  selectedRuns,
  setShowRefreshButton = () => {},
  functionToBeExecuted = () => {}
) => {
  setShowRefreshButton(true);
  await AxiosInstance.post("/api/setBatsmanChoice", {
    matchId: id,
    team,
    selectedRuns,
  });
  setShowRefreshButton(!(await showChoiceSelector(id, team)));
  functionToBeExecuted();
};

function BatterPage({ team, id }) {
  const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState(false);
  const [score, setScore] = useState(125);
  const [wickets, setWickets] = useState(3);
  const [batsmen, setBatsmen] = useState([
    { name: "John Doe", score: 56, balls: 34, fours: 7, sixes: 2 },
    { name: "Jane Smith", score: 32, balls: 22, fours: 4, sixes: 1 },
  ]);
  const [bowler, setBowler] = useState(["Not set"]);
  const [overs, setOvers] = useState(0.0);
  const [totalOvers, setTotalOvers] = useState(0.0);
  const [selfTeamName, setSelfTeamName] = useState("");
  const [opponentTeamName, setOpponentTeamName] = useState("");
  const [currentStrikeRate, setCurrentStrikeRate] = useState(120.5);
  const [showBatsmanSelector, setShowBatsmanSelector] = useState(false);
  const [projectedScore, setProjectedScore] = useState(250);
  const [showRefreshButton, setShowRefreshButton] = useState(false);
  const buttons = [0, 1, 2, 3, 4, 6];

  const functionToBeExecuted = async () => {
    await checkInnings(id).then((innings) => {
      if (innings >= 1) {
        navigate("/defendTarget");
        return;
      } else {
        getShowBatsmanSelector();
      }
    });
  };

  const getChoiceSelector = async () => {
    console.log("Getting showBatsmanSelector");
    const showChoice = await showChoiceSelector(id, team);
    console.log("showChoice", showChoice);
    setShowRefreshButton(!getChoiceSelector());
  };

  useEffect(() => {
    if (showRefreshButton) {
      const getShowRefreshButtonInterval = startInterval(async () => {
        console.log("Getting showRefreshButton");
        const showChoice = await showChoiceSelector(id, team);
        if (showChoice) {
          setShowRefreshButton(false);
          functionToBeExecuted();
        }
      }, 1000);
      return () => clearInterval(getShowRefreshButtonInterval);
    }
  }, [showRefreshButton]);

  useEffect(() => {
    getShowBatsmanSelector();
  }, []);

  useEffect(() => {
    if (bowler === undefined || bowler.length === 0) {
      const getBowlerInterval = startInterval(async () => {
        console.log("Getting bowler");
        const bowlerPlaying = await getBowlerPlaying(id, team);
        if (bowlerPlaying.length > 0) {
          bowlerPlaying[0].overs = bowlerPlaying[0].oversBowled;
          setBowler(bowlerPlaying[0]);
        }
      }, 1000);
      return () => clearInterval(getBowlerInterval);
    }
  }, [bowler]);

  const getShowBatsmanSelector = async () => {
    await AxiosInstance.post("/api/getShowBatsmanSelector", {
      matchId: id,
      team,
    })
      .then(async (response) => {
        if (response.data.success) {
          setShowBatsmanSelector(response.data.showBatsmanSelector);
          if (!response.data.showBatsmanSelector) {
            getStatsForBatsmenPage();
            setShowRefreshButton(!(await showChoiceSelector(id, team)));
          }
        } else {
          console.error("The server responded with error.");
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getStatsForBatsmenPage = () => {
    AxiosInstance.post("/api/getStatsForBatterPage", {
      matchId: id,
      team,
    })
      .then((response) => {
        const stats = response.data;
        if (stats.success) {
          setScore(stats.score);
          setWickets(stats.wickets);
          setBatsmen(stats.batsmen);
          setBowler(stats.bowler[0]);
          setOvers(stats.overs);
          setTotalOvers(stats.totalOvers);
          setSelfTeamName(stats.selfTeamName);
          setOpponentTeamName(stats.opponentTeamName);
          setCurrentStrikeRate(stats.currentStrikeRate);
          setProjectedScore(stats.projectedScore);
        } else {
          console.error("backend did not correctly responded.");
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div>
      {!showSummary ? (
        <div className="batter-page">
          {showBatsmanSelector ? (
            <PlayerSelector
              id={id}
              team={team}
              getShowBatsmanSelector={functionToBeExecuted}
            />
          ) : (
            <div>
              <h2>
                {selfTeamName}:{" "}
                {score +
                  "/" +
                  wickets +
                  " " +
                  "(" +
                  overs +
                  "/" +
                  totalOvers +
                  ")"}
              </h2>

              <div style={{ marginBottom: 30 }}>
                <h3>Batsmen:</h3>
                {batsmen.map((batsman, index) => (
                  <div key={index}>
                    <p>
                      <strong>
                        {batsman.playerName}
                        {batsman.isStriker ? "*" : ""}
                      </strong>
                      : Score: {batsman.score}, Balls: {batsman.balls}, Fours:{" "}
                      {batsman.fours}, Sixes: {batsman.sixes}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 30 }}>
                <h3>{opponentTeamName}'s Bowler:</h3>
                {!bowler || bowler.length === 0 ? (
                  "Waiting for a bowler to join..."
                ) : (
                  <div>
                    <p>
                      <strong>{bowler.playerName}</strong>: Overs:{" "}
                      {bowler.overs}, Runs Given: {bowler.runsGiven}, Wickets
                      Taken: {bowler.wicketsTaken}
                    </p>
                  </div>
                )}
              </div>

              <h3>
                Current Strike Rate:{" "}
                {currentStrikeRate ? currentStrikeRate : "NaN"}
              </h3>
              <h3>
                Projected Score: {projectedScore ? projectedScore : "NaN"}
              </h3>
              <h3>Try For:</h3>
              <h5>
                Note: Choosing to go for a high score raises the risk of losing
                a wicket.
              </h5>

              {showRefreshButton ? (
                <p style={{ marginBottom: 0 }}>
                  {" "}
                  Waiting for opponent to bowl...
                </p>
              ) : (
                <div className="runs-selection">
                  {buttons.map((button, index) => (
                    <button
                      key={index}
                      className="runs-button"
                      onClick={() =>
                        handleRunsSelection(
                          id,
                          team,
                          button,
                          setShowRefreshButton,
                          functionToBeExecuted
                        )
                      }
                    >
                      {button}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <LastSixBalls id={id} team={team} change={showRefreshButton} />

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

export default BatterPage;
