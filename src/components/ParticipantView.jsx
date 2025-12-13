import "../App.css";

import { useParticipant, VideoPlayer } from "@videosdk.live/react-sdk";
import  { useEffect, useRef } from "react";

function ParticipantView({ participantId }) {
  const micRef = useRef();
  const { micStream, micOn, webcamOn, displayName, isLocal } =
    useParticipant(participantId);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const ms = new MediaStream();
        ms.addTrack(micStream.track);
        micRef.current.srcObject = ms;
        micRef.current.play().catch(() => {});
      }
    }
  }, [micStream, micOn]);

  return (
    <div className="participant-box">
      <audio ref={micRef} autoPlay muted={isLocal} />

      {webcamOn ? (
        <VideoPlayer participantId={participantId} />
      ) : (
        <div className="participant-placeholder">
          {displayName?.charAt(0)}
        </div>
      )}

      <div className="participant-label">
        {displayName} {isLocal ? "(You)" : ""}
      </div>
    </div>
  );
}

export default ParticipantView;
