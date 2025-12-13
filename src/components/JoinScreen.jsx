import "../App.css";

import  { useState } from "react";

function JoinScreen({ getMeetingAndToken }) {
  const [id, setId] = useState("");

  return (
    <div className="page-center">
      <div className="card">

        <h2>Join a Meeting</h2>

        <input
          className="input"
          placeholder="Enter meeting ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <button
          className="btn btn-full"
          disabled={!id.trim()}
          onClick={() => getMeetingAndToken(id)}
        >
          Join Room
        </button>

        <button
          className="btn-secondary btn-full"
          style={{ marginTop: 10 }}
          onClick={() => getMeetingAndToken(null)}
        >
          Create New Room
        </button>

      </div>
    </div>
  );
}

export default JoinScreen;
