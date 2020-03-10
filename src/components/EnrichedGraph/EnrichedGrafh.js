/* eslint-disable indent */
import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

class EnrichedGrafh extends Component {
  state = {
    data: 'holines',
    zoomed: null,
    nodes: [],
    links: []
  }

  nodeRef = createRef()

  zoom = d3.zoom()
    .scaleExtent([1, -1])
    .scaleExtent([-5, 5])
    // .translateExtent([[-100, -100], [props.width+100, props.height]])

  simulation = d3.forceSimulation()

  get traslate () {
    if (!this.state.zoomed) return ''
    const { x, y, k } = this.state.zoomed
    return `translate(${x}, ${y}) scale(${k})`
  }

  constructor (props) {
    super(props)
    const { graph } = props
    this.state = {
      nodes: graph.nodes.map(e => Object.create({
        ...e,
        level: graph.links.reduce((c, l) => (l.target === e._key || l.source === e._key) ? c + 1 : c, 0)
      })),
      links: graph.links.map(e => Object.create(e))
    }
  }

  componentDidMount () {
    const { width, height } = this.props
    console.log(this.state)

    d3.select(this.nodeRef.current).call(this.zoom)

    this.zoom
      .on('zoom', () => this.setState({ zoomed: d3.event.transform }))

    this.simulation
      .nodes(this.state.nodes)
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody().strength(d => d.level > 4 ? -100 : -1).distanceMin(d => d.level).distanceMax(100))
      .force('links', d3.forceLink(this.state.links).id(e => e._key))
      .on('tick', () => this.setState({ nodes: this.state.nodes, links: this.state.links }))
  }

  render () {
    const { width, height } = this.props
    console.log(this.state)
    return (
      <svg width={width} height={height} ref={this.nodeRef}>
        <g transform={this.traslate}>
          {this.state.nodes.map(n => <circle key={n.index} cx={n.x} cy={n.y} r={n.level} />)}
          {this.state.links.map(l => <line key={l.index} x1={l.target.x} y1={l.target.y} x2={l.source.x} y2={l.source.y} strokeWidth={0.5} stroke='black' />)}
        </g>
      </svg>
    )
  }
}

EnrichedGrafh.defaultProps = {
  width: 500,
  height: 500
}

EnrichedGrafh.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  graph: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired
  }).isRequired
}

export default EnrichedGrafh
