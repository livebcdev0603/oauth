import axios from 'axios'
import { google } from 'googleapis'
// const contains = require("mout/array/contains");
// const get = require("mout/object/get");

// const errors = require("../../errors");
import { OAUTH_GOOGLE_ID, OAUTH_GOOGLE_SECRET, URL_WEB } from 'setup/config/env'
import params from 'setup/config/params'

export let oauth2Client

const AUTH_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/gmail.readonly',
]

export const getOauth2Client = () => {
  return oauth2Client
}

export const createOauth2Client = () => {
  oauth2Client = new google.auth.OAuth2(
    OAUTH_GOOGLE_ID,
    OAUTH_GOOGLE_SECRET,
    `${URL_WEB}/${params.user.oauth.redirectUri}`,
  )
}

const isV2AuthApi = (url) => {
  return url.includes('/o/oauth2/v2/auth')
}

export const genAuthUrl = () => {
  // const oauth2Client = getOauth2Client();
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
  return oauth2Client.generateAuthUrl(opts)
}

export const getToken = async (code) => {
  // const oauth2Client = getOauth2Client();
  createOauth2Client()
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)
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
export const refreshToken = async () => {
  oauth2Client.on('tokens', (tokens) => {
    console.log(
      '🚀 ~ file: googleapi.js ~ line 80 ~ oauth2Client.on ~ tokens.refresh_token',
      tokens.refresh_token,
    )
    if (tokens.refresh_token) {
      // store the refresh_token in my database!
    }
  })
}
