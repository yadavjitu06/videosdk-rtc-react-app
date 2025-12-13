import "../App.css";

import { useMeeting } from "@videosdk.live/react-sdk";
import { useState } from "react";

function RoomSwitchModal({ currentMeetingId, onClose }) {
  const { switchTo, requestMediaRelay } = useMeeting();
  const [targetRoomId, setTargetRoomId] = useState("");
  const [mode, setMode] = useState("normal");
  const [relay, setRelay] = useState({ video: true, audio: true });

  const handleNormal = async () => {
    await switchTo({ meetingId: targetRoomId, token: "" });
    onClose();
  };

  const handleRelay = async () => {
    const kinds = [];
    if (relay.video) kinds.push("video");
    if (relay.audio) kinds.push("audio");

    await requestMediaRelay({
      destinationMeetingId: targetRoomId,
      token: "",
      kinds,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">

        <h2>Switch Room</h2>
        <p>Current: {currentMeetingId}</p>

        <input
          className="input"
          placeholder="Target room ID"
          value={targetRoomId}
          onChange={(e) => setTargetRoomId(e.target.value)}
        />

        <div className="row">
          <button
            className="btn"
            onClick={() => setMode("normal")}
          >
            Normal
          </button>

          <button
            className="btn-secondary"
            onClick={() => setMode("relay")}
          >
            Relay
          </button>
        </div>

        {mode === "relay" && (
          <div style={{ marginTop: 15 }}>
            <label>
              <input
                type="checkbox"
                checked={relay.video}
                onChange={(e) => setRelay({ ...relay, video: e.target.checked })}
              />
              Video
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={relay.audio}
                onChange={(e) => setRelay({ ...relay, audio: e.target.checked })}
              />
              Audio
            </label>
          </div>
        )}

        <button
          className="btn btn-full"
          onClick={mode === "normal" ? handleNormal : handleRelay}
          style={{ marginTop: 15 }}
        >
          Continue
        </button>

        <button className="btn-secondary btn-full" onClick={onClose}>
          Cancel
        </button>

      </div>
    </div>
  );
}

export default RoomSwitchModal;
