const SET_PERIMETER = 'SET_PERIMETER'
const SELECT_PERIMETER = 'SELECT_PERIMETER'
const UNSELECT_PERIMETER = 'UNSELECT_PERIMETER'
// -------------------------------------------------------- initial State

export const initState = {
  data: [],
  count: 0,
  select: {},
  selected: false
}

// -------------------------------------------------------- Actions

export const setPerimeter = (payload) => ({ type: SET_PERIMETER, payload })
export const selectPerimeter = (payload) => ({ type: SELECT_PERIMETER, payload })
export const unselectPerimeter = (payload) => ({ type: UNSELECT_PERIMETER })

// -------------------------------------------------------- Reducer

// TODO: verify perimeter uniqueness
export default (state = initState, { type, payload }) => {
  if (type === SET_PERIMETER) {
    return {
      ...state,
      data: [...state.data, payload],
      count: state.count + 1
    }
  }

  if (type === SELECT_PERIMETER) {
    return {
      ...state,
      select: payload,
      selected: true
    }
  }

  if (type === UNSELECT_PERIMETER) {
    return {
      ...state,
      select: null,
      selected: false
    }
  }
  return state
}
