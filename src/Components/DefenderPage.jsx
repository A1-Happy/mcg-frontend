import {
  getOpponentStats,
  getSelfStats,
  getTargetAndRemainingBalls,
} from "./chaserPage";
import { useEffect, useState } from "react";
import {
  getBowlerPlaying,
  getBatsmenPlaying,
  checkInnings,
} from "./chaserPage";
import BowlerSelector from "./BowlerSelector";
import { handleBallSpeedSelection } from "./BowlerPage";
import { showChoiceSelector } from "./BatterPage";
import LastSixBalls from "./LastSixBalls";
import MatchSummary from "./MatchSummary";

import { useNavigate } from "react-router-dom";
import { startInterval } from "../utils";

export default function DefenderPage({ id, team }) {
  const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState(false);
  const [opponent, setOpponent] = useState({});
  const [bowler, setBowler] = useState([]);
  const [batsmen, setBatsmen] = useState([]);
  const [targetAndRemainingBalls, setTargetAndRemainingBalls] = useState({});
  const [self, setSelf] = useState({});
  const choices = ["Very Slow", "Slow", "Fast", "Very Fast"];
  const [isChoiceSelectorShown, setIsChoiceSelectorShown] = useState(false);

  const getOtherDetails = async () => {
    setOpponent(await getOpponentStats(id, team));
    setBatsmen(await getBatsmenPlaying(id));
    setSelf(await getSelfStats(id, team));
    setTargetAndRemainingBalls(await getTargetAndRemainingBalls(id));
  };

  const getInningsAndUpdateStats = async () => {
    const innings = await checkInnings(id);
    console.log(innings);
    if (innings === 2) {
      navigate("/summary");
      return;
    }
    const bowler = await getBowlerPlaying(id);
    setBowler(bowler);
    if (bowler.length !== 1) {
      return;
    } else {
      getOtherDetails();
    }
  };

  useEffect(() => {
    getInningsAndUpdateStats();
  }, []);

  useEffect(() => {
    if (batsmen.length < 2) {
      const updateBatsmenInterval = startInterval(async () => {
        console.log("Updating batsmen...");
        const newBatsmen = await getBatsmenPlaying(id);
        if (newBatsmen.length === 2) {
          setBatsmen(newBatsmen);
          clearInterval(updateBatsmenInterval);
        }
      }, 1000);
      // return clearInterval(updateBatsmenInterval);
    }
  }, [batsmen]);

  useEffect(() => {
    if (!isChoiceSelectorShown) {
      const getShowChoiceSelectorInterval = startInterval(async () => {
        console.log("Updating choice selector...");
        const newChoice = await showChoiceSelector(id, team);
        if (newChoice) {
          setIsChoiceSelectorShown(true);
          getInningsAndUpdateStats();
          clearInterval(getShowChoiceSelectorInterval);
        }
      }, 1000);
    }
  }, [isChoiceSelectorShown]);

  return (
    <div>
      {!showSummary ? (
        <div>
          {bowler.length !== 1 ? (
            <BowlerSelector
              id={id}
              team={team}
              getShowSelectBowler={getInningsAndUpdateStats}
            />
          ) : (
            <div>
              <h2>
                {opponent.teamName}: {opponent.score}/{opponent.wickets} (
                {opponent.oversTaken}/{opponent.totalOvers})
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
                  {opponent.teamName} require {targetAndRemainingBalls.target}{" "}
                  runs in {targetAndRemainingBalls.remainingBalls} balls to win.{" "}
                </h4>
                <h5>
                  {self.teamName}: {self.score}/{self.wickets} (
                  {self.oversTaken})
                </h5>
              </div>
              <h4>Choose your bowling speed:</h4>
              <h5>
                Note: A faster ball raises the chances of both wickets and
                boundaries.
              </h5>

              {isChoiceSelectorShown ? (
                <div className="runs-selection">
                  {choices.map((choice, index) => (
                    <button
                      key={index}
                      className="runs-button"
                      onClick={async () => {
                        console.log(
                          await handleBallSpeedSelection(id, team, index)
                        );
                        setIsChoiceSelectorShown(false);
                        console.log(await getInningsAndUpdateStats());
                      }}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              ) : (
                <div>Waiting for the striker to bat...</div>
              )}
            </div>
          )}
          <LastSixBalls id={id} team={team} change={isChoiceSelectorShown} />
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
