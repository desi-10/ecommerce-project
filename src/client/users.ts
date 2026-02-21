import axios from "axios";

export async function updateProfile(data: {
  name?: string;
  image?: string;
}) {
  const res = await axios.patch("/api/auth/profile", data);
  return res.data;
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const res = await axios.post("/api/auth/change-password", data);
  return res.data;
}

export async function getCurrentUser() {
  const res = await axios.get("/api/auth/me");
  return res.data;
}
