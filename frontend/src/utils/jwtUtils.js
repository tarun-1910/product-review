export function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
   const payload = JSON.parse(atob(token.split(".")[1]));
       return {
         userId: payload.userId,
         email: payload.sub,
         fullName: payload.fullName
       };
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}
