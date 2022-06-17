// Imports

// App imports
import { getToken, getUserInfo } from 'setup/helpers/googleapi'

// google
export default async function google({ code }) {
  let userProvider

  // 1. get access_token account using OAuth code
  const tokens = await getToken(code)
  // console.log("🚀 ~ file: google.js ~ line 24 ~ google ~ access", tokens)

  // 2. get user details
  if (tokens && tokens.access_token) {
    const me = await getUserInfo(tokens)

    if (me && me.id) {
      userProvider = {
        email: me.email,
        name: me.name,
        tokens: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        },
      }
    }
  }

  return userProvider
}
