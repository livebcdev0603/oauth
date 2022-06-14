// Imports
import axios from 'axios'

// App imports
import { OAUTH_GOOGLE_ID, OAUTH_GOOGLE_SECRET, URL_WEB } from 'setup/config/env'
import params from 'setup/config/params'
// const { google } = require("googleapis");

// google
export default async function google({ code }) {
  let userProvider

  // 1. get access_token account using OAuth code
  const access = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: OAUTH_GOOGLE_ID,
      client_secret: OAUTH_GOOGLE_SECRET,
      redirect_uri: `${URL_WEB}/${params.user.oauth.redirectUri}`,
      grant_type: 'authorization_code',
      code,
    },
  })
  // console.log("🚀 ~ file: google.js ~ line 24 ~ google ~ access", access.data)

  // 2. get user details
  if (access.data && access.data.access_token) {
    const me = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${access.data.access_token}`,
      },
      // responseType: 'json',
    })

    if (me.data && me.data.id) {
      userProvider = {
        email: me.data.email,
        name: me.data.name,
        tokens: {
          access_token: access.data.access_token,
          refresh_token: access.data.refresh_token,
          expiry_date: ((new Date()).getTime() + (access.data.expires_in * 1000)),
        },
      }
    }
  }

  return userProvider
}
