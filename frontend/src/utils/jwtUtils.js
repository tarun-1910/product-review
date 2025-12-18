export function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // JWT format: header.payload.signature
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    return payload.userId || null;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}
