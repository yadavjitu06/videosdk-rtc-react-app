// src/components/MeetingContainer.jsx
import { useMeeting } from "@videosdk.live/react-sdk";
import { useState } from "react";

import MeetingView from "./MeetingView";

export default function MeetingContainer(props) {
  const { onLeave } = props;
  const [isMeetingJoined, setMeetingJoined] = useState(false);

  useMeeting({
    onMeetingJoined: () => setMeetingJoined(true),
    onMeetingLeft: () => {
      setMeetingJoined(false);
      try {
        if (typeof onLeave === "function") onLeave();
      } catch (err) {
        console.error("onLeave callback error:", err);
      }
    },
  });

  return isMeetingJoined ? (
    <MeetingView {...props} />
  ) : (
    <main className="container" role="main" aria-busy>
      <h2>Joining {props.currentMeetingId}...</h2>
    </main>
  );
}
