import React, { useState, useEffect } from "react";
import AxiosInstance from "./AxiosInstance";
import { useNavigate } from "react-router-dom";

const TossLoser = ({ isCaller, opponentTeamName, team, id }) => {
  const navigate = useNavigate();
  const [opponentMove, setOpponentMove] = useState(null);

  const onStartBatting = () => {
    navigate("/batting");
  };

  const onStartBowling = () => {
    navigate("/bowling");
  };

  const refreshOpponentMove = () => {
    console.log("Refreshing opponent's move...");
    AxiosInstance.post("/api/getTossDecision", { id })
      .then((response) => {
        const { decision } = response.data;
        if (decision) {
          setOpponentMove(decision);
        }
      })
      .catch((error) => {
        console.error("Error refreshing opponent's move:", error);
      });
  };

  useEffect(() => {
    if (!opponentMove) {
      refreshOpponentMove();
      const interval = setInterval(() => {
        refreshOpponentMove();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [opponentMove]);

  return (
    <div>
      <h3>
        {isCaller
          ? "You lost the toss."
          : "Your opponent " + opponentTeamName + " has won the toss."}
      </h3>
      {!opponentMove ? (
        <div>
          <h5>Please wait for the opponent to make their move.</h5>
        </div>
      ) : (
        ""
      )}
      {opponentMove && (
        <div>
          <h5>Opponent has decided to {opponentMove} first.</h5>
          <button
            onClick={opponentMove === "bat" ? onStartBowling : onStartBatting}
          >
            Start {opponentMove === "bat" ? "bowling" : "batting"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TossLoser;
