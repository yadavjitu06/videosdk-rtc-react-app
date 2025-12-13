// src/api.js



// const API_BASE_URL = "https://api.videosdk.live/v1";






// export async function createMeeting() {
//   const res = await fetch(`${API_BASE_URL}/meetings`, {
//     method: "POST",
//     headers: {
//       "Authorization": token,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({}),
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(`Failed to create meeting: ${error.message || res.statusText}`);
//   }

//   const { meetingId } = await res.json();
//   return meetingId; 
// }



















export const token = process.env.REACT_APP_VIDEOSDK_TOKEN || "";

// eslint-disable-next-line
export const createMeeting = async () => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const { roomId } = await res.json();
  return roomId;
};






