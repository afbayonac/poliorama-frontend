import React, { Component, createElement } from 'react'
import { FaTwitter } from 'react-icons/fa'
import QueryString from 'querystring'
import axios from 'axios'
import Promise from 'bluebird'
import PropTypes from 'prop-types'
import styles from './styles.module.sass'

const twitterAuthenticateUrl = 'https://api.twitter.com/oauth/authenticate'

class AuthTwitter extends Component {
  constructor (props) {
    super(props)
    this.handleAuth = this.handleAuth.bind(this)
  }

  getOauthToken () {
    return axios({
      method: this.props.endpointOauthToken.method,
      url: this.props.endpointOauthToken.url,
      headers: { ...this.props.customHeaders, 'Content-Type': 'application/json' }
    })
  }

  getVerify (oauthToken, oauthVerifier) {
    return axios({
      method: this.props.endpointVerifyToken.method,
      url: this.props.endpointVerifyToken.url,
      headers: { ...this.props.customHeaders, 'Content-Type': 'application/json' },
      data: { oauthToken, oauthVerifier }
    })
  }

  async handleAuth () {
    let popup
    let oauthToken

    try {
      oauthToken = (await this.getOauthToken()).data.oauthToken
    } catch (e) {
      return this.props.onFailure('error get oauth token')
    }

    try {
      popup = await this.popup()
      popup.location = `${
        twitterAuthenticateUrl
      }?oauth_token=${oauthToken
      }&&oauth_token=${this.props.forceLogin
      }${this.props.screenName ? '&&screen_name=' + this.props.screenName : ''}`
    } catch (e) {
      return this.props.onFailure('error get verifier token')
    }

    try {
      const res = (await this.getVerify(oauthToken, await this.polling(popup))).data
      return this.props.onSuccess(res)
    } catch (e) {
      popup.close()
      return this.props.onFailure('error verify token')
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
      width=${this.props.dialogWidth},
      height=${this.props.dialogHeight},
      top=100
      left=100`
    )
  }

  render () {
    console.log('style: ', styles)
    const twitterButton = createElement(
      this.props.tag,
      {
        onClick: this.handleAuth,
        style: this.props.style,
        disabled: this.props.disabled,
        className: this.props.className || this.props.tag === 'a' ? styles.link : styles.button
      }, (
        <span>
          {this.props.showIcon && (<FaTwitter color='#00ACEE' size={17} />)} <span>{this.props.text}</span>
        </span>
      )
    )

    return twitterButton
  }
}

AuthTwitter.propTypes = {
  tag: PropTypes.oneOf('buttom, a'),
  text: PropTypes.string,
  endpointOauthToken: PropTypes.shape({
    url: PropTypes.string.isRequired,
    method: PropTypes.oneOf('POST', 'GET').isRequired
  }).isRequired,
  endpointVerifyToken: PropTypes.shape({
    url: PropTypes.string.isRequired,
    method: PropTypes.oneOf('POST', 'GET').isRequired
  }).isRequired,
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
  tag: 'a',
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
