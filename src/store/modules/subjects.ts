import { action } from 'typesafe-actions'

const SET_SUBJECT = 'SET_SUBJECT'
const SELECT_SUBJECT = 'SELECT_SUBJECT'
const UNSELECT_SUBJECT = 'UNSELECT_SUBJECT'
// -------------------------------------------------------- initial State

export const initState = {
  data: [],
  count: 0,
  select: {},
  selected: false
}

// -------------------------------------------------------- Actions

export const setSubject = (payload: any) => action(SET_SUBJECT, payload)
export const selectSubject = (payload: any) => action(SELECT_SUBJECT, payload)
export const unselectSubject = () => action(UNSELECT_SUBJECT)

// -------------------------------------------------------- Reducer

// TODO: verify subject uniqueness
export default (state = initState, { type, payload }: { type: string, payload: any}) => {
  if (type === SET_SUBJECT) {
    return {
      ...state,
      data: [...state.data, payload],
      count: state.count + 1
    }
  }

  if (type === SELECT_SUBJECT) {
    return {
      ...state,
      select: payload,
      selected: true
    }
  }

  if (type === UNSELECT_SUBJECT) {
    return {
      ...state,
      select: null,
      selected: false
    }
  }
  return state
}
