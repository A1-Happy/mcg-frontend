import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const Navigate = useNavigate();
  return (
    <>
      <h1>MULTIPLAYER CRICKET GAME</h1>
      <div style={{ padding: 0 }} className="card">
        <button
          onClick={() => {
            Navigate("/host-game");
          }}
        >
          Create Game
        </button>
      </div>
      <div className="card">
        <button
          onClick={() => {
            Navigate("join-game");
          }}
        >
          Join Game
        </button>
      </div>
    </>
  );
}

export default Home;
