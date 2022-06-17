// Unset user jwtToken and info in localStorage and cookie
export default function logoutUnsetUserLocalStorage() {
  // Remove jwtToken
  window.localStorage.removeItem('jwtToken')
  window.localStorage.removeItem('user')
}
