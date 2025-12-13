import "../App.css";

import { useMeeting } from "@videosdk.live/react-sdk";
import  { useState } from "react";

import Controls from "./Controls";
import MediaRelayHandler from "./MediaRelayHandler";
import ParticipantView from "./ParticipantView";

function MeetingView({ onMeetingLeave }) {
  const [joined, setJoined] = useState(false);
  const { join, participants } = useMeeting({
    onMeetingJoined: () => setJoined(true),
    onMeetingLeft: onMeetingLeave,
  });

  return (
    <div className="meeting-container">
      <MediaRelayHandler />

      {!joined ? (
        <button className="btn" onClick={join}>
          Join Meeting
        </button>
      ) : (
        <>
          <Controls />

          <div className="grid">
            {[...participants.keys()].map((id) => (
              <ParticipantView key={id} participantId={id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MeetingView;
