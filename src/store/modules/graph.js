const POPULATE_GRAPH = 'POPULATE_GRAPH'

// -------------------------------------------------------- initial State

export const initState = {
  nodes: [],
  links: [],
  populated: false
}

// -------------------------------------------------------- Actions

export const populateGraph = (payload) => ({ type: POPULATE_GRAPH, payload })

// -------------------------------------------------------- Reducer

// TODO: verify perimeter uniqueness
export default (state = initState, { type, payload }) => {
  if (type === POPULATE_GRAPH) {
    return {
      ...payload,
      populated: true
    }
  }

  return state
}
