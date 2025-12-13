import "./App.css";

import { MeetingProvider } from "@videosdk.live/react-sdk";
import { useState } from "react";

import { createMeeting, token } from "./api";
import JoinScreen from "./components/JoinScreen";
import MeetingView from "./components/MeetingView";

function App() {
  const [meetingId, setMeetingId] = useState(null);

  const getMeetingAndToken = async (id) => {
    const meeting = id || (await createMeeting());
    setMeetingId(meeting);
  };
  const [userName] = useState(() => "User-" + Math.floor(Math.random() * 5000));

  return meetingId ? (
    <MeetingProvider
      token={token}
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: userName,
      }}
    >
      <MeetingView onMeetingLeave={() => setMeetingId(null)} />
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}

export default App;
