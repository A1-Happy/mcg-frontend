import AxiosInstance from "./AxiosInstance";
import { useState, useEffect } from "react";

export default function LastSixBalls({ id, team, change }) {
  const [balls, setBalls] = useState([1, 2, 3, 4, 6, "wicket"]);

  const getLastSixBalls = async () => {
    const response = await AxiosInstance.post("/api/getLastSixBalls", {
      matchId: id,
      team,
    });

    console.log("balls", response.data);
    setBalls(response.data);
  };

  useEffect(() => {
    getLastSixBalls();
  }, [change]);
  return (
    <div hidden={balls.length === 0}>
      <div style={{ marginBottom: 30 }}></div>
      <h3>Recent over:</h3>
      <div
        className="last-six-balls"
        style={{
          flexDirection: "row",
          display: "flex",
          flex: 1,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {balls.map((ball, index) => (
          <div
            style={{
              padding: 5,
              margin: 5,
              borderRadius: 100,
              paddingLeft: 10,
              paddingRight: 10,
              minWidth: 15,
              // if first ball should be light blue and others black
              border: index === 0 ? "2px solid grey" : "2px solid black",
            }}
            className={ball === "W" ? "redball" : "greenball"}
            key={index}
          >
            {ball}
          </div>
        ))}
      </div>
    </div>
  );
}
