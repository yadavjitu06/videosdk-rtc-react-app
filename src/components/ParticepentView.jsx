// src/components/ParticipantView.jsx
import { useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useRef } from "react";

export default function ParticipantView({ participantId }) {
  const participant = useParticipant(participantId) || {};
  const { webcamOn, webcamStream, displayName, audioOn } = participant;
  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (webcamOn && webcamStream?.track) {
      const ms = new MediaStream([webcamStream.track]);
      el.srcObject = ms;
      const play = () => el.play().catch(() => {});
      if (el.readyState >= 2) play();
      else el.onloadedmetadata = play;
    } else {
      el.srcObject = null;
    }

    return () => {
      if (el) el.srcObject = null;
    };
  }, [webcamOn, webcamStream]);

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
    : "?";

  return (
    <article
      className="participant-card"
      aria-label={displayName || "Participant"}
    >
      <div className="participant-media">
        {webcamOn ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="participant-video"
          />
        ) : (
          <div className="participant-no-video" aria-hidden>
            <div className="initial">{initials}</div>
          </div>
        )}
      </div>

      <div className="participant-footer">
        <div className="p-name">{displayName ?? "Participant"}</div>
        <div className="p-icons">
          <span className={`mic ${audioOn ? "on" : "off"}`} aria-hidden />
          <span className={`cam ${webcamOn ? "on" : "off"}`} aria-hidden />
        </div>
      </div>
    </article>
  );
}
