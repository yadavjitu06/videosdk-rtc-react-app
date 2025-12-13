import "../App.css";

import { useMeeting } from "@videosdk.live/react-sdk";
import  { useState } from "react";

function MediaRelayHandler() {
  const [request, setRequest] = useState(null);

  useMeeting({
    onMediaRelayRequestReceived: ({
      meetingId,
      displayName,
      accept,
      reject,
    }) => {
      setRequest({ displayName, meetingId, accept, reject });
    },
  });

  if (!request) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Media Relay Request</h3>
        <p>{request.displayName} wants to relay into your room.</p>

        <button
          className="btn btn-full"
          onClick={() => {
            request.accept();
            setRequest(null);
          }}
        >
          Accept
        </button>

        <button
          className="btn-danger btn-full"
          onClick={() => {
            request.reject();
            setRequest(null);
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default MediaRelayHandler;
