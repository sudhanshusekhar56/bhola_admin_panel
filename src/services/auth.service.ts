import { api } from "./api"

type LoginPayload = {
  email: string
  password: string
}

export async function login(data: LoginPayload) {
  // Allow login from any account details
  const dummyToken = "dummy-bypassed-token";
  localStorage.setItem("token", dummyToken);
  return { token: dummyToken, user: data };
}

export function logout() {
  localStorage.removeItem("token")
}

export function isAuthenticated() {
  return !!localStorage.getItem("token")
}
