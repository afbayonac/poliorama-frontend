const SET_USER = 'SET_USER'

// -------------------------------------------------------- initial State

const initState = {
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
      pic: payload.pic,
      screenName: payload.screenName,
      _key: payload._key,
      login: true
    }
  }

  return state
}
