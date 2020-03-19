const SET_USER = 'SET_USER'

// -------------------------------------------------------- initial State

export const initState = {
  pic: undefined,
  screenName: undefined,
  _key: undefined,
  login: false
}

// -------------------------------------------------------- Actions

export const setUser = (payload) => ({ type: SET_USER, payload })

// -------------------------------------------------------- Reducer

export default (state = initState, { type, payload }) => {
  if (type === SET_USER) {
    return {
      ...state,
      picUrl: payload.picUrl,
      screenName: payload.screenName,
      _key: payload._key,
      login: true
    }
  }
  return state
}
