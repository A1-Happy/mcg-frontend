import React, { useState } from "react";
import AxiosInstance from "./AxiosInstance";
import { useNavigate } from "react-router-dom";

const TossWinner = ({ isCaller, id }) => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [willBat, setWillBat] = useState(false);

  const onStartBatting = () => {
    navigate("/batting");
  };

  const onStartBowling = () => {
    navigate("/bowling");
  };

  const handleDecision = (decision) => {
    AxiosInstance.post("/api/chooseBatOrBall", { decision, id })
      .then((response) => {
        const { success } = response.data;
        if (success) {
          setWillBat(decision === "bat" ? true : false);
          setSuccess(success);
        }
      })
      .catch((error) => {
        console.error("Error sending choice:", error);
        // Handle error here
      });
  };

  return (
    <div>
      <h3>Toss Winner</h3>
      <h5>
        Congratulations!{" "}
        {isCaller ? "You won the toss." : "Your opponent has lost the toss."}{" "}
        Choose your move:
      </h5>

      {!success ? (
        <div>
          {" "}
          <button
            style={{ marginRight: 10 }}
            onClick={() => handleDecision("bat")}
          >
            Bat
          </button>
          <button onClick={() => handleDecision("bowl")}>Bowl</button>
        </div>
      ) : (
        ""
      )}

      {success && (
        <div>
          {willBat ? (
            <button onClick={onStartBatting}>Start Batting</button>
          ) : (
            <button onClick={onStartBowling}>Start Bowling</button>
          )}
        </div>
      )}
    </div>
  );
};

export default TossWinner;
