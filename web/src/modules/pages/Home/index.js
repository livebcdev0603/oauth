// Imports
import React from 'react'
import { Helmet } from 'react-helmet'

// UI imports
import Button from 'ui/Button'
import './style.css'

// App imports
import { URL_WEB } from 'setup/config/env'
import params from 'setup/config/params'
import AuthCheck from 'modules/common/AuthCheck'
import google from 'setup/oauth/google'
// import facebook from 'setup/oauth/facebook'
// import instagram from 'setup/oauth/instagram'
// import linkedin from 'setup/oauth/linkedin'
// import twitter from 'setup/oauth/twitter'
// import reddit from 'setup/oauth/reddit'
// import discord from 'setup/oauth/discord'
// import zoom from 'setup/oauth/zoom'
// import github from 'setup/oauth/github'
// import gitlab from 'setup/oauth/gitlab'
// import digitalocean from 'setup/oauth/digitalocean'
// import bitbucket from 'setup/oauth/bitbucket'
import azure from 'setup/oauth/azure'
// import spotify from 'setup/oauth/spotify'
// import shopify from 'setup/oauth/shopify'

// Component
const Home = () => {
  // render
  return (
    <>
      {/* meta */}
      <Helmet>
        <title>{`Home · ${params.site.name}`}</title>
      </Helmet>

      {/* content */}
      <section className='pages-home'>
        <p>Welcome guest! Sign in with:</p>

        <div className='group'>
          {/* social */}
          <section className='social'>
            <a href={google()}>
              <Button
                title='Google'
                image={`${URL_WEB}/images/social/google.svg`}
              />
            </a>
            <a href={azure()}>
              <Button
                title='Azure'
                image={`${URL_WEB}/images/tech/azure.svg`}
              />
            </a>
          </section>
        </div>
      </section>

      {/* check user already logged in */}
      <AuthCheck />
    </>
  )
}

export default Home
