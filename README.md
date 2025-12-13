Room Switching & Media Relay – Simple & Clear Documentation
 What This App Can Do

This project includes all the important features needed for multi-room live video communication:

Create and join VideoSDK rooms

Switch between rooms using switchTo()

Send your audio/video to another room using Media Relay

Accept or reject media relay requests

Real-time audio/video communication

Turn microphone & camera ON/OFF

Automatic participant grid

Clean, responsive, beautiful UI

 Room Switching Types
 1. Normal Room Switch (switchTo())

👉 Moves you completely from Room A → Room B

✔ Benefits

Fast switching (no reconnection)

Reuses the same socket & media connections

Smooth transition

Media stays active

 2. Media Relay (requestMediaRelay())

 You stay in Room A, but your audio/video also goes to Room B

✔ Benefits

Perfect for PK battles, dual-room livestreams, collaborations

You stay visible in both rooms

Destination room needs to approve the relay

Can send only audio, only video, or both

 Setup Guide
 Requirements

Node.js (v14+)

npm

VideoSDK Account

1. Clone the Repo
git clone https://github.com/yadavjitu06/videosdk-rtc-react-app
cd videosdk-room-demo

 2. Install Dependencies
npm install
npm install @videosdk.live/react-sdk

 3. Run the App
npm start


Visit: http://localhost:3000

 4. Get Your VideoSDK Token

Go to VideoSDK Dashboard

Generate a temporary token

Create a file: src/API.js

Paste this:

export const authToken = "YOUR_TOKEN_HERE";

export const createMeeting = async () => {
  const res = await fetch("https://api.videosdk.live/v2/rooms", {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
  });

  const { roomId } = await res.json();
  return roomId;
};


Run again:

npm start

 How to Test
 Test Normal Room Switching
Step 1 — Open Tab 1 (Room A)

Click Create Room

Copy Room ID

Join the room

Step 2 — Open Tab 2 (Room B)

Create another room

Join it

Step 3 — Switch Rooms

In Room A:

Click Switch Room

Select Normal Switch

Enter Room B ID

Click Switch to Room

 You will instantly move from Room A → Room B

 Test Media Relay
Step 1 — Create Two Rooms

Room A in Tab 1

Room B in Tab 2

Step 2 — Send Relay Request (from Room A)

Click Switch Room

Select Media Relay

Enter Room B ID

Choose audio/video

Click Send Relay Request

Step 3 — Accept in Room B

Room B sees a popup

Click Accept

 Room A’s participant appears inside Room B
 Room A user does not leave their room

 How It Works (Simple Explanation)
 Normal Switch

Flow:

User calls switchTo()

SDK keeps the same WebSocket connection

Only the room context changes

User appears in the new room immediately

✔ Very fast
✔ No media restart

 Media Relay:-

Flow:

User calls requestMediaRelay()

Destination room receives request

If accepted → video/audio stream is forwarded

User stays in original room

Best for PK & live collaborations
No need to leave current room