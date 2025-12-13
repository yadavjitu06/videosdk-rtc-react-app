import "../App.css";

import { useMeeting } from "@videosdk.live/react-sdk";
import { useState } from "react";

import RoomSwitchModal from "./RoomSwitchModal";

function Controls() {
  const { leave, toggleMic, toggleWebcam, meetingId } = useMeeting();
  const [showSwitch, setShowSwitch] = useState(false);

  return (
    <>
      <div className="controls-bar">

        <button className="btn" onClick={toggleMic}>Mic</button>
        <button className="btn" onClick={toggleWebcam}>Cam</button>
        <button className="btn-secondary" onClick={() => setShowSwitch(true)}>
          Switch
        </button>
        <button className="btn-danger" onClick={leave}>Leave</button>

      </div>

      {showSwitch && (
        <RoomSwitchModal
          currentMeetingId={meetingId}
          onClose={() => setShowSwitch(false)}
        />
      )}
    </>
  );
}

export default Controls;
