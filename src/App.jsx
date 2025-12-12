// src/App.jsx (FULL CORRECTED VERSION)
import "./App.css";

import { MeetingProvider } from "@videosdk.live/react-sdk";
import { useCallback, useEffect,useState } from "react";

import { createMeeting } from "./api";
import MeetingContainer from "./components/MeetingContainer";

const token = process.env.REACT_APP_VIDEOSDK_TOKEN || "";

export default function App() {
  const urlRoom = new URLSearchParams(window.location.search).get("room");
  const [providerMeetingId, setProviderMeetingId] = useState(urlRoom || null);
  const [displayMeetingId, setDisplayMeetingId] = useState(urlRoom || null);
  const [roomAId, setRoomAId] = useState(null);
  const [roomBId, setRoomBId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputId, setInputId] = useState("");
  const [meetingKey, setMeetingKey] = useState(0);
  const [error, setError] = useState(null);
  const [selectedCameraId, setSelectedCameraId] = useState(null);

  // Camera devices list get karna (optional)
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          if (videoDevices.length > 0 && !selectedCameraId) {
            // First available camera select karein
            setSelectedCameraId(videoDevices[0].deviceId);
          }
        })
        .catch(err => console.log("Device enumeration error:", err));
    }
  }, []);

  // Yeh function meeting config provide karega
  const getMeetingConfig = () => {
    const config = {
      meetingId: providerMeetingId,
      micEnabled: true,
      webcamEnabled: true,
      name: `User-${Date.now().toString().slice(-4)}`,
      participantId: `user-${Date.now()}`,
      
      // IMPORTANT: Yeh constraints timeout fix karengi
      constraints: {
        video: {
          // Agar specific camera select karna hai to yeh use karein
          // deviceId: selectedCameraId ? { exact: selectedCameraId } : undefined,
          
          // Simple constraints jo sab cameras par work kare
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 24, max: 30 },
          facingMode: "user" // Front camera use karein
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      },
      
      // Timeout settings badha dein
      notificationTimeout: 10000, // 10 seconds
      
      // Multi-stream support
      multiStream: true,
      
      // Permissions
      permissions: {
        askToJoin: false,
        toggleParticipantWebcam: true,
        toggleParticipantMic: true,
        drawOnWhiteboard: true,
        toggleWhiteboard: true,
      }
    };
    
    return config;
  };

  // Create two rooms and join Room A (Host)
  const prepareAndJoinRooms = useCallback(async () => {
    if (!token) {
      setError("REACT_APP_VIDEOSDK_TOKEN not configured.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const realRoomAId = await createMeeting(token);
      const realRoomBId = await createMeeting(token);
      setRoomAId(realRoomAId);
      setRoomBId(realRoomBId);
      setProviderMeetingId(realRoomAId);
      setDisplayMeetingId(realRoomAId);
      setMeetingKey((s) => s + 1);
    } catch (e) {
      console.error("prepareAndJoinRooms:", e);
      setError(e?.message || "Failed to create rooms");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Join by ID (participant)
  const handleJoinById = useCallback(() => {
    const id = inputId.trim();
    if (!id) {
      setError("Please enter a Room ID");
      return;
    }
    setError(null);
    setProviderMeetingId(id);
    setDisplayMeetingId(id);
    setMeetingKey((s) => s + 1);
  }, [inputId]);

  const handleLeave = useCallback(() => {
    setProviderMeetingId(null);
    setDisplayMeetingId(null);
    setMeetingKey((s) => s + 1);
  }, []);

  const handleMeetingSwitched = useCallback((newId) => {
    setProviderMeetingId(newId);
    setDisplayMeetingId(newId);
    setMeetingKey((s) => s + 1);
  }, []);

  if (!providerMeetingId) {
    return (
      <main className="home-outer" role="main">
        <section className="home-inner">
          <header className="home-header" aria-labelledby="app-title">
            <div className="logo-spot" aria-hidden="true">🎥</div>
            <h1 id="app-title" className="home-title">VideoSDK Room Switcher</h1>
            <p className="home-sub">Room Switch + Media Relay Demo</p>
          </header>

          <article className="card home-card" aria-labelledby="create-heading">
            <section className="create-section">
              <div className="small-header">
                <div className="icon-green" aria-hidden="true">+</div>
                <h2 id="create-heading">Create as Host</h2>
              </div>
              <p>Create two rooms (A & B) and join Room A as the host.</p>
              <div className="actions">
                <button
                  className="primary-action"
                  onClick={prepareAndJoinRooms}
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? "Creating Rooms..." : "Prepare Rooms & Join Room A (Host)"}
                </button>
              </div>
            </section>

            <div className="divider" aria-hidden="true">OR</div>

            <section className="join-section" aria-labelledby="join-heading">
              <div className="small-header">
                <div className="icon-purple" aria-hidden="true">👥</div>
                <h2 id="join-heading">Join as Participant</h2>
              </div>
              <p>Enter a Room ID to join an existing meeting</p>
              <div className="join-row">
                <label htmlFor="joinInput" className="sr-only">Room ID</label>
                <input
                  id="joinInput"
                  className="join-input"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  placeholder="Enter Room ID (e.g., room-abc123)"
                  onKeyDown={(e) => e.key === "Enter" && handleJoinById()}
                />
                <button className="secondary-action" onClick={handleJoinById}>
                  Join →
                </button>
              </div>
            </section>

            <footer className="note">
              <strong>Note:</strong> Token is loaded from environment variable.
              Make sure to set your `REACT_APP_VIDEOSDK_TOKEN`.
            </footer>

            {error && (
              <div className="error" role="alert">{error}</div>
            )}
          </article>
        </section>
      </main>
    );
  }

  return (
    <MeetingProvider
      key={meetingKey}
      config={getMeetingConfig()}
      token={token}
      joinWithoutUserInteraction={true}
    >
      <MeetingContainer
        createMeetingFn={(tkn) => createMeeting(tkn)}
        onNewRoomBCreated={(newId) => setRoomBId(newId)}
        currentMeetingId={displayMeetingId || providerMeetingId}
        onSwitchRoom={() => {
          const newMeetingId = (displayMeetingId || providerMeetingId) === roomAId
            ? roomBId
            : roomAId;
          return { newMeetingId, token };
        }}
        onLeave={handleLeave}
        roomBId={roomBId}
        roomAId={roomAId}
        authToken={token}
        onMeetingSwitched={handleMeetingSwitched}
      />

      {roomBId && (
        <div className="roomb-floating" aria-hidden="true">
          <div className="small">Room B ID (share with other tab):</div>
          <code className="mono">{roomBId}</code>
          <button onClick={() => navigator.clipboard?.writeText(roomBId)}>Copy</button>
        </div>
      )}
    </MeetingProvider>
  );
}