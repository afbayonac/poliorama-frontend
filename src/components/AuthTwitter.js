import React, { Component } from 'react'
import QueryString from 'querystring'
import axios from 'axios'
import Promise from 'bluebird'
import PropTypes from 'prop-types'

class AuthTwitter extends Component {
  constructor (props) {
    super(props)
    this.handleAuth = this.handleAuth.bind(this)
  }

  getOauthToken () {
    return axios.post(this.props.urlOauthToken)
  }

  getJWT (oauthToken, oauthVerifier) {
    return axios.post(this.props.urlVerifyToken, { oauth_token: oauthToken, oauth_verifier: oauthVerifier })
  }

  async handleAuth () {
    const popup = await this.popup()
    let oauthToken
    try {
      oauthToken = await this.getOauthToken()
      popup.location = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken.data.oauth_token}`
      const res = await this.getJWT(oauthToken.data.oauth_token, await this.polling(popup))
      console.log(res)
    } catch (e) {
      popup.close()
      return console.log(e)
    }
  }

  polling (popup) {
    return new Promise((resolve, reject) => {
      const polling = setInterval(() => {
        if (!popup || popup.closed || popup.closed === undefined) {
          clearInterval(polling)
          reject(new Error('Popup has been closed by user'))
        }

        try {
          if (popup.location.hostname.indexOf('api.twitter.com') === -1 && !(popup.location.hostname === '')) {
            let oauthVerifier
            if (popup.location.search) {
              const query = QueryString.parse(popup.location.search.slice(1))
              oauthVerifier = query.oauth_verifier
            }
            clearInterval(polling)
            popup.close()
            resolve(oauthVerifier)
          }
        } catch (error) {
          // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
          // A hack to get around same-origin security policy errors in IE.
        }
      }, 500)
    })
  }

  popup () {
    return window.open('', '', `
      toolbar=no,
      location=no, 
      directories=no, 
      status=no, 
      menubar=no, 
      scrollbars=no, 
      resizable=no, 
      copyhistory=no, 
      width=500,
      height=500`
      // top=100
      // left=100`
    )
  }

  render () {
    return (
      <button onClick={this.handleAuth}>
        {this.props.text}
      </button>)
  }
}

AuthTwitter.propTypes = {
  tag: PropTypes.string,
  text: PropTypes.string,
  urlOauthToken: PropTypes.string.isRequired,
  urlVerifyToken: PropTypes.string.isRequired,
  onFailure: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  dialogWidth: PropTypes.number,
  dialogHeight: PropTypes.number,
  showIcon: PropTypes.bool,
  customHeaders: PropTypes.object,
  forceLogin: PropTypes.bool,
  screenName: PropTypes.string
}

AuthTwitter.defaultProps = {
  tag: 'button',
  text: 'Sign in with Twitter',
  disabled: false,
  dialogWidth: 600,
  dialogHeight: 400,
  showIcon: true,
  credentials: 'same-origin',
  customHeaders: {},
  forceLogin: false,
  screenName: ''
}

export default AuthTwitter
