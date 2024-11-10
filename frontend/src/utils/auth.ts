import { decodeJwt } from "jose"

export const getUserData = () => {
  const token = localStorage.getItem("auth-token")
  const decoded = decodeJwt(token)
  return decoded
}