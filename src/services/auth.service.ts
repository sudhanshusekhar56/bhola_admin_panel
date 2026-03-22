import { api } from "./api"

type LoginPayload = {
  email: string
  password: string
}

export async function login(data: LoginPayload) {
  const response = await api.post("/auth/login", data)

  const token = response.data.token

  localStorage.setItem("token", token)

  return response.data
}

export function logout() {
  localStorage.removeItem("token")
}

export function isAuthenticated() {
  return !!localStorage.getItem("token")
}
