// src/components/MeetingView.jsx
import { useMeeting } from "@videosdk.live/react-sdk";
import { useCallback, useEffect, useRef, useState } from "react";

import ParticipantView from "./ParticepentView";

export default function MeetingView({
  currentMeetingId,
  onSwitchRoom,
  roomBId,
  onMeetingSwitched,
  authToken,
   createMeetingFn,      
  onNewRoomBCreated,
}) {
  const {
    localParticipant,
    participants,
    leave,
    requestMediaRelay,
    stopMediaRelay,
    
    
  } = useMeeting({
    
    onMediaRelayRequestResponse: ({ decision }) => {
      if (decision === "accepted") setRelayActive(true);
      else setRelayActive(false);
    },
    onMediaRelayStarted: () => setRelayActive(true),
    onMediaRelayStopped: () => setRelayActive(false),
    onMediaRelayError: ({ error }) => {
      console.error("Media relay error:", error);
      setRelayActive(false);
    },
  });


  

  const [relayActive, setRelayActive] = useState(false);
  const relayRef = useRef(relayActive);
  useEffect(() => {
    relayRef.current = relayActive;
  }, [relayActive]);

  const otherParticipants = Array.from(participants.keys()).filter(
    (id) => id !== localParticipant?.id
  );

  useEffect(() => {
  const enableCamera = async () => {
    if (localParticipant) {
      try {
        // Pehle existing video tracks stop karein
        const localTracks = localParticipant.tracks;
        localTracks.forEach(track => {
          if (track.kind === "video") track.stop();
        });
        
        // Naya camera track start karein
        await localParticipant.enableWebcam();
        console.log("Camera manually enabled");
      } catch (err) {
        console.error("Manual camera enable failed:", err);
      }
    }
  };

  if (localParticipant && participants.size > 0) {
    enableCamera();
  }
}, [localParticipant, participants]);

  const handleSwitchRoom = useCallback(async () => {
    const { newMeetingId } = onSwitchRoom();
    if (!newMeetingId) return;

    try {
      if (relayRef.current && roomBId) {
        try {
          await stopMediaRelay({ destinationMeetingId: roomBId });
        } catch (e) {
          console.warn("stopMediaRelay pre-switch failed:", e);
        } finally {
          setRelayActive(false);
        }
      }

      leave();

      await new Promise((r) => setTimeout(r, 350));

      onMeetingSwitched(newMeetingId);
    } catch (e) {
      console.error("Error during room switch:", e);
      alert("Room switch failed: " + (e?.message || e));
    }
  }, [leave, onSwitchRoom, onMeetingSwitched, roomBId, stopMediaRelay]);
  const handleStopRelay = useCallback(async () => {
  if (!roomBId || !relayRef.current) return;
  try {
    await stopMediaRelay({ destinationMeetingId: roomBId });
    setRelayActive(false);
  } catch (e) {
    console.error("stopMediaRelay failed:", e);
  }
}, [roomBId, stopMediaRelay]);

  const handleStartRelay = useCallback(async () => {
    // if roomBId missing, try to create it automatically
    let destinationId = roomBId;

    if (!destinationId) {
      if (typeof createMeetingFn === "function") {
        try {
          destinationId = await createMeetingFn(authToken);
          console.log("Auto-created Room B:", destinationId);
          // if parent wants to record it in state (App), call callback
          if (typeof onNewRoomBCreated === "function") onNewRoomBCreated(destinationId);
        } catch (err) {
          console.error("Auto-create Room B failed:", err);
          alert("Failed to create Room B: " + (err?.message || err));
          return;
        }
      } else {
        alert("Room B ID not set in this tab. Create Room B in host tab or paste Room B ID here.");
        return;
      }
    }

    try {
      await requestMediaRelay({
        destinationMeetingId: destinationId,
        token: authToken,
        kinds: ["video", "audio"],
      });
    } catch (e) {
      console.error("requestMediaRelay failed:", e);
      alert("Failed to start media relay: " + (e?.message || e));
    }
  }, [roomBId, authToken, requestMediaRelay, createMeetingFn, onNewRoomBCreated]);

  useEffect(() => {
    // ensure relay is stopped on unmount
    return () => {
      if (relayRef.current && roomBId) {
        stopMediaRelay({ destinationMeetingId: roomBId }).catch(() => {});
      }
    };
  }, [roomBId, stopMediaRelay]);

 useEffect(() => {
  async function fixCam() {
    if (!localParticipant) return;

    // Correct track stopping (VideoSDK v0.3+)
    localParticipant?.streams?.forEach((stream) => {
      if (stream.kind === "video") {
        stream.track?.stop?.();
      }
    });

    try {
      await localParticipant.enableWebcam();
      console.log("Webcam enabled successfully");
    } catch (err) {
      console.error("Webcam enable failed:", err);
    }
  }

  fixCam();
}, [localParticipant]);



  return (
    <div className="meeting-outer">
      <header className="meeting-header">
        <div className="left">
          <div className="logo" aria-hidden>
            🎥
          </div>
          <div>
            <h1 className="room-title">Room</h1>
            <p className="room-id small">{currentMeetingId}</p>
          </div>
        </div>

        <div className="right">
          <div className="live-pill" aria-hidden>
            ● Live
          </div>
          <button
            className="leave-btn"
            onClick={() => {
              try {
                leave();
              } catch (err) {
                console.error("leave failed", err);
                alert("Failed to leave");
              }
            }}
          >
            Leave
          </button>
        </div>
      </header>

      <main className="container main-content" role="main">
        <section
          className="card room-info"
          aria-labelledby="current-room-heading"
        >
          <div>
            <h2 id="current-room-heading" className="room-heading">
              Current Room: Room
            </h2>
            <div className="room-row">
              <div className="room-label">Room ID:</div>
              <div className="room-value mono">{currentMeetingId}</div>
            </div>
          </div>
          <div className="participants-pill">
            {participants.size} Participants
          </div>
        </section>

        <section className="participants-grid" aria-live="polite">
          {localParticipant && (
            <ParticipantView
              key={localParticipant.id}
              participantId={localParticipant.id}
            />
          )}
          {otherParticipants.map((id) => (
            <ParticipantView key={id} participantId={id} />
          ))}
        </section>

        <section className="controls-grid">
          <article
            className="card switch-card"
            aria-labelledby="switch-heading"
          >
            <div className="icon" aria-hidden>
              ⇄
            </div>
            <h3 id="switch-heading">Switch Room</h3>
            <p className="muted">Move to the other room seamlessly</p>
            <button className="primary-btn" onClick={handleSwitchRoom}>
              Switch to Other Room
            </button>
          </article>

          <article className="card relay-card" aria-labelledby="relay-heading">
            <div className="icon" aria-hidden>
              📡
            </div>
            <h3 id="relay-heading">Media Relay</h3>
            <p className="muted">
              {relayActive
                ? `Broadcasting to ${roomBId}`
                : "Send audio/video to other room"}
            </p>

            {!relayActive ? (
              <button className="accent-btn" onClick={handleStartRelay}>
                Start Relay to Room B
              </button>
            ) : (
              <button className="danger-btn" onClick={handleStopRelay}>
                Stop Relay
              </button>
            )}
          </article>

          {roomBId && (
            <article className="card share-card" aria-label="Room b share">
              <div className="label">Room B ID (Share with participants):</div>
              <div className="share-row">
                <code className="mono">{roomBId}</code>
                <button
                  className="copy-small"
                  onClick={() => navigator.clipboard?.writeText(roomBId)}
                >
                  Copy
                </button>
              </div>
            </article>
          )}
        </section>
      </main>
    </div>
  );
}
