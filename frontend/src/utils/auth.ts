import { decodeJwt } from "jose"

export const getUserData = () => {
  // TODO: REMOVE THIS WHEN ACTUAL LOGIN IS IMPLEMENTED
  // AND REPLACE WITH THE ACTUAL LOGIN LOGIC REMOVED BECAUSE OF CORS ISSUES
  // const token = localStorage.getItem("auth-token")
  // const decoded = decodeJwt(token)
  // return decoded

  const username = localStorage.getItem("username")
  return { username, id: username }
}
