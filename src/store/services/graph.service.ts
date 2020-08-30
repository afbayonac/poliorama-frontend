import { populateGraph } from '../modules/graph'
import axios from 'axios'
import { Dispatch } from 'redux';

export const getGraph = () => async (dispatch: Dispatch): Promise<void> => {
  axios
    .get(`${process.env.REACT_APP_API_POLIORAMA}/perimeter?limit=50`)
    .then(({ data }) => {
      dispatch(populateGraph({
        nodes: data,
        links: Array(data.length * 3).fill(null).map( _ => ({
          target: data[Math.floor(Math.random() * data.length)]._key,
          source: data[Math.floor(Math.random() * data.length)]._key
        }))
      }))
    })
    .catch(e => console.log(e))
}

