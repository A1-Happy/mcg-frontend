import { useEffect, useState } from "react";
import "../App.css";
import AxiosInstance from "./AxiosInstance";
import BowlerSelector from "./BowlerSelector";
import { checkInnings } from "./ChaserPage";
import { useNavigate } from "react-router-dom";
import { getBatsmenPlaying } from "./ChaserPage";
import { showChoiceSelector } from "./BatterPage";
import { startInterval } from "../utils";
import LastSixBalls from "./LastSixBalls";
import MatchSummary from "./MatchSummary";

export const handleBallSpeedSelection = async (id, team, selection) => {
  await AxiosInstance.post("/api/setBowlingSpeed", {
    matchId: id,
    team,
    speed: selection,
  });
};

function BowlerPage({ team, id, opponentTeamName }) {
  const navigate = useNavigate();

  const [showSummary, setShowSummary] = useState(false);
  const [score, setScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [totalOvers, setTotalOvers] = useState(5);
  const [showSelectBowler, setShowSelectBowler] = useState(false);
  const [loaded, setLoaded] = useState(true);
  const [batsmen, setBatsmen] = useState([]);
  const [bowler, setBowler] = useState([
    { playerName: "Loading...", runsGiven: 0, overs: 0 },
  ]);
  const [oversBowled, setOversBowled] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const choices = ["Very Slow", "Slow", "Fast", "Very Fast"];

  const functionToBeExecuted = async () => {
    await checkInnings(id).then((innings) => {
      console.log("Innings: ", innings);
      if (innings >= 1) {
        navigate("/chaseTarget");
        return;
      } else {
        getShowSelectBowler();
      }
    });
  };

  useEffect(() => {
    if (batsmen.length !== 2) {
      const getBatsmenInterval = startInterval(async () => {
        console.log("Getting batsmen");
        const batsmenPlaying = await getBatsmenPlaying(id, team);
        if (batsmenPlaying.length === 2) {
          setBatsmen(batsmenPlaying);
        }
      }, 1000);
      return () => clearInterval(getBatsmenInterval);
    }
  }, [batsmen]);

  useEffect(() => {
    functionToBeExecuted();
  }, []);

  useEffect(() => {
    if (!showChoices) {
      const getShowChoicesInterval = startInterval(async () => {
        console.log("Getting show choices");
        const showChoices = await showChoiceSelector(id, team);
        if (showChoices) {
          setShowChoices(showChoices);
          functionToBeExecuted();
        }
      }, 1000);
      return () => clearInterval(getShowChoicesInterval);
    }
  }, [showChoices]);

  const getShowSelectBowler = async () => {
    await AxiosInstance.post("/api/getShowSelectBowler", { team, matchId: id })
      .then((response) => {
        if (response.data.success) {
          setShowSelectBowler(response.data.showSelectBowler);
          setLoaded(true);
          getBowlerStats();
        } else {
          console.log("The backend responded with error.");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getBowlerStats = () => {
    AxiosInstance.post("/api/getBowlerStats", { matchId: id, team })
      .then((response) => {
        const stats = response.data;
        if (response.data.success) {
          setScore(stats.score);
          setBatsmen(stats.batsmen);
          setBowler(stats.bowler);
          setTotalOvers(stats.totalOvers);
          setOversBowled(stats.oversBowled);
          setWickets(stats.wickets);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      {showSummary ? (
        <MatchSummary id={id} team={team} setShowSummary={setShowSummary} />
      ) : (
        <div className="bowler-page">
          {showSelectBowler ? (
            <BowlerSelector
              id={id}
              team={team}
              getShowSelectBowler={functionToBeExecuted}
            />
          ) : (
            <div>
              <h2>
                {opponentTeamName}:{" "}
                {score +
                  "/" +
                  wickets +
                  " " +
                  "(" +
                  oversBowled +
                  "/" +
                  totalOvers +
                  ")"}
              </h2>
              <div style={{ marginBottom: 30 }}>
                <h3>Batsmen:</h3>
                {batsmen.length !== 0
                  ? batsmen
                      // .sort((a, b) => (a.isStriker ? -1 : 1))
                      .map((batsman, index) => (
                        <p key={index}>
                          <strong>
                            {batsman.playerName +
                              (batsman.isStriker ? "*" : "")}
                          </strong>
                          {":    " +
                            `Score: ${batsman.score}, Balls: ${batsman.balls}, Fours: ${batsman.fours}, Sixes: ${batsman.sixes}`}
                        </p>
                      ))
                  : "Waiting for batsmen..."}
              </div>

              <div style={{ marginBottom: 30 }}>
                <h3>Bowler:</h3>

                {bowler.map((bowler, index) => (
                  <div key={index}>
                    <p>
                      <strong>{bowler.playerName}</strong>: Overs:{" "}
                      {bowler.overs}, Runs Given: {bowler.runsGiven}, Wickets
                      Taken: {bowler.wicketsTaken}
                    </p>
                  </div>
                ))}
              </div>

              <h3 style={{ marginBottom: 30 }}>
                Current Economy Rate:{" "}
                {bowler.length > 0
                  ? (bowler[0].runsGiven / bowler[0].overs).toFixed(2)
                  : "NaN"}
              </h3>
              <h3>Choose your bowling speed:</h3>
              <h5>
                Note: A faster ball raises the chances of both wickets and
                boundaries.
              </h5>

              {showChoices ? (
                <div className="runs-selection">
                  {choices.map((choice, index) => (
                    <button
                      key={index}
                      className="runs-button"
                      onClick={async () => {
                        console.log(index);
                        await handleBallSpeedSelection(id, team, index);
                        setShowChoices(false);
                        await functionToBeExecuted();
                      }}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              ) : (
                <p style={{ marginBottom: 0 }}>
                  Waiting for the other team's move...
                </p>
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
      )}
    </div>
  );
}

export default BowlerPage;
