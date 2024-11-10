export const getUserData = () => {
  //the id should be deterministic based on the username
  const username = localStorage.getItem("username")
  const id = username.split("").map(c => c.charCodeAt(0)).join('');
  return { username, id }
}
