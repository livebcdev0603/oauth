import axios from 'axios'
import { google } from 'googleapis'
// const contains = require("mout/array/contains");
// const get = require("mout/object/get");

// const errors = require("../../errors");
import { OAUTH_GOOGLE_ID, OAUTH_GOOGLE_SECRET, URL_WEB } from 'setup/config/env'
import params from 'setup/config/params'

export let oAuth2Client

const AUTH_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/gmail.readonly',
]

export const getOauth2Client = () => {
  return oAuth2Client
}

export const createOauth2Client = () => {
  oAuth2Client = new google.auth.OAuth2(
    OAUTH_GOOGLE_ID,
    OAUTH_GOOGLE_SECRET,
    `${URL_WEB}/${params.user.oauth.redirectUri}`,
  )
  return oAuth2Client
}

export const setCredentials = async (tokens) => {
  if (!oAuth2Client) {
    createOauth2Client()
  }
  return await oAuth2Client.setCredentials(tokens)
}

const isV2AuthApi = (url) => {
  return url.includes('/o/oauth2/v2/auth')
}

export const genAuthUrl = () => {
  // const oAuth2Client = getOauth2Client();
  createOauth2Client()
  const opts = {
    access_type: 'offline',
    scope: AUTH_SCOPES,
    state: params.user.oauth.providers.google.key,
  }
  if (isV2AuthApi(google.auth.OAuth2.GOOGLE_OAUTH2_AUTH_BASE_URL_)) {
    opts.prompt = 'consent'
  } else {
    opts.approval_prompt = 'force'
  }
  return oAuth2Client.generateAuthUrl(opts)
}

export const getToken = async (code) => {
  // const oAuth2Client = getOauth2Client();
  createOauth2Client()
  const { tokens } = await oAuth2Client.getToken(code)
  oAuth2Client.setCredentials(tokens)
  return tokens
}

export const getUserInfo = async (token) => {
  const url = 'https://www.googleapis.com/oauth2/v2/userinfo'
  const res = await axios.get(url, {
    headers: {
      Authorization: `OAuth ${token.access_token}`,
    },
  })
  return res.data
}

// export const allowMailDomain = async (token, options) => {
//   const email = await getMailAddress(token);
//   const domain = email.split("@")[1];
//   return contains(options.allow_email_domains, domain) && email;
// };

// TODO: this function
export const refreshToken = async (tokens) => {
  try {
    // if (!oAuth2Client) {
    //   await createOauth2Client()
    // }
    await setCredentials(tokens)

    oAuth2Client.on('tokens', (tokens) => {
      console.log("🚀 ~ file: googleapi.js ~ line 95 ~ oAuth2Client.on ~ tokens", tokens)
      if (tokens.refresh_token) {
        // store the refresh_token in my database!
        return tokens
      }
    })

    const tokenInfo = await oAuth2Client.getTokenInfo(tokens.access_token)

    // let user = await User.findOne({ email: tokenInfo.email })
    if (tokenInfo.expiry_date <= new Date().getDate()) {
      const access = await oAuth2Client.refreshToken(tokens.refresh_token)
      await setCredentials(access.tokens)
      return access.tokens
    }
    return false
  } catch (error) {
    console.log('🚀 tokenInfo---error', error)
    const access = await oAuth2Client.refreshToken(tokens.refresh_token)
    await setCredentials(access.tokens)
    return access.tokens
  }
}
