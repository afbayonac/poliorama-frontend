import React, { Component } from "react";
import { extent, scaleLinear, max, line} from 'd3'

const red = '#eb6a5b';
const blue = '#52b6ca';

class EnrichedGrafh extends Component {
  state = {
    data: 'holines'
  }

  componentDidMount() {
    const data = [
      { "x": 1,   "y": 5},
      { "x": 20,  "y": 20},
      { "x": 40,  "y": 10},
      { "x": 60,  "y": 40},
      { "x": 65,  "y": 5},
      { "x": 100, "y": 60},
      { "x": 120, "y": 10},
      { "x": 130, "y": 40},
      { "x": 134, "y": 5},
      { "x": 180, "y": 60}
    ]

    const xDomain = extent(data, d => d.x)
    const yMax = max(data, d => d.y)

    const xScale = scaleLinear().range([0, 100])
    xScale.domain(xDomain)
    const yScale = scaleLinear().range([100, 0])
    yScale.domain([0, yMax])

    const lineGenerator = line()

    lineGenerator.x(d =>  xScale(d.x))
    lineGenerator.y(d => yScale(d.y))

    const path = lineGenerator(data)
    this.setState({path})
  }

  render () {
    return (
      <svg width={100} height={100} >
        <path d={this.state.path} fill='none' stroke={red} strokeWidth={2}/>
        <text y={20} >{this.state.data}</text>
      </svg>
    )
  }
}

export default EnrichedGrafh
