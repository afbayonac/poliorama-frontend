import { action } from 'typesafe-actions'

const POPULATE_GRAPH = 'POPULATE_GRAPH'

// -------------------------------------------------------- initial State

export const initState = {
  nodes: [],
  links: [],
  populated: false
}

// -------------------------------------------------------- Actions

export const populateGraph = (payload: any) => action(POPULATE_GRAPH, payload)

// -------------------------------------------------------- Reducer

// TODO: verify subjects uniqueness
export default (state = initState, { type , payload }: { type: string, payload: any }) => {
  if (type === POPULATE_GRAPH) {
    return {
      ...payload,
      populated: true
    }
  }

  return state
}
