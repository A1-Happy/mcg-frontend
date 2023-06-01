import { useEffect, useState } from "react";
import "../App.css";
import AxiosInstance from "./AxiosInstance";
import { useNavigate } from "react-router-dom";

function Caller({ id, team }) {
  const navigate = useNavigate();
  const onChoiceSubmit = async (selectedChoice) => {
    try {
      const response = await AxiosInstance.post("/api/submitChoice", {
        id: id,
        team: team,
        choice: selectedChoice,
      });
      const { hasWon } = response.data;
      // Handle the hasWon response
      if (hasWon) {
        navigate("/toss-won");
      } else {
        navigate("/toss-lost");
      }
    } catch (error) {
      console.error("Error submitting choice:", error);
      // Handle the error
    }
  };

  return (
    <>
      <h3>Your Turn</h3>
      <div className="toss-options">
        <button
          style={{ marginRight: 20 }}
          onClick={() => onChoiceSubmit("Head")}
        >
          Head
        </button>
        <button onClick={() => onChoiceSubmit("Tail")}>Tail</button>
      </div>
    </>
  );
}

function Opponent({ opponentTeamName, id, team }) {
  const navigate = useNavigate();
  const onRefreshClick = async () => {
    console.log("Refreshing opponent...");
    try {
      const response = await AxiosInstance.post("/api/refreshOpponent", {
        id: id,
        team: team,
      });
      const { hasWon, success } = response.data;
      if (hasWon !== undefined && hasWon !== null && success) {
        if (hasWon) {
          navigate("/toss-won");
        } else {
          navigate("/toss-lost");
        }
      }
    } catch (error) {
      console.error("Error refreshing opponent:", error);
      // Handle the error
    }
  };

  useEffect(() => {
    onRefreshClick();
    const refreshInterval = setInterval(() => {
      onRefreshClick();
    }, 1000);
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <>
      <h3>Waiting for {opponentTeamName}'s Choice</h3>
      <div className="toss-waiting">
        <p>Please wait until the other user makes their choice.</p>
      </div>
    </>
  );
}

function Toss({ isCaller, opponentTeamName, team, id }) {
  const [choice, setChoice] = useState("");

  const handleChoice = (selectedChoice) => {
    setChoice(selectedChoice);
  };

  return (
    <div className="toss-container">
      {isCaller ? (
        <Caller
          handleChoice={handleChoice}
          opponentTeamName={opponentTeamName}
          id={id}
          team={team}
        />
      ) : (
        <Opponent opponentTeamName={opponentTeamName} id={id} team={team} />
      )}

      {choice && (
        <div className="toss-result">
          <h3>You chose: {choice}</h3>
        </div>
      )}
    </div>
  );
}

export default Toss;
