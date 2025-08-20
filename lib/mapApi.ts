const API_KEY = "5b3ce3597851110001cf6248853e4fb71a0f4f0b9ca6f0fc3d61c9a7"; // Replace with your actual key

export async function getDirections(start: [number, number], end: [number, number]) {
  const res = await fetch("https://api.openrouteservice.org/v2/directions/foot-walking", {
    method: "POST",
    headers: {
      Authorization: API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: [start, end],
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch directions");
  }

  return await res.json();
}
