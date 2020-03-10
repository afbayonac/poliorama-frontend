import { populateGraph } from './modules/graph'
import axios from 'axios'

const fetchGraph = () => {
  return dispatch => {
    axios
      .get(`${process.env.REACT_APP_API_POLIORAMA}/perimeter?limit=50`)
      .then(({ data }) => {
        dispatch(populateGraph({
          nodes: data,
          links: Array(data.length * 3).fill().map(e => ({
            target: data[Math.floor(Math.random() * data.length)]._key,
            source: data[Math.floor(Math.random() * data.length)]._key
          }))
        }))
      })
      .catch(e => console.log(e))
  }
}

export default fetchGraph
