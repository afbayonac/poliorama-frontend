/* eslint-disable indent */
import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

import { selectPerimeter } from '../../store/modules/perimeters'
import styles from './styles.module.sass'

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
      nodes: graph.nodes.map(e => ({
        ...e,
        level: graph.links.reduce((c, l) => (l.target === e._key || l.source === e._key) ? c + 1 : c, 0)
      })),
      links: graph.links.map(e => Object.create(e))
    }
    this.handleOnClickNode = this.handleOnClickNode.bind(this)
  }

  componentDidMount () {
    const { width, height } = this.props

    d3.select(this.nodeRef.current).call(this.zoom)

    this.zoom
      .on('zoom', () => this.setState({ zoomed: d3.event.transform }))

    this.simulation
      .nodes(this.state.nodes)
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody().strength(d => d.level > 4 ? -100 : -1).distanceMin(d => d.level).distanceMax(100))
      .force('links', d3.forceLink(this.state.links).id(e => e._key))
      .force('collide', d3.forceCollide(d => d.level * 2))
      .on('tick', () => this.setState({ nodes: this.state.nodes, links: this.state.links }))
  }

  handleOnClickNode (e) {
    this.props.actions.selectPerimeter(e)
  }

  render () {
    const { width, height, select } = this.props
    return (
      <svg width={width} height={height} ref={this.nodeRef}>
        <g transform={this.traslate}>
          {this.state.links.map((l, i) => <line key={i} x1={l.target.x} y1={l.target.y} x2={l.source.x} y2={l.source.y} strokeWidth={0.5} stroke='black' />)}
          {this.state.nodes.map((n, i) =>
            <Node
              key={i}
              cx={n.x} cy={n.y} r={n.level} onClick={this.handleOnClickNode} data={n}
              selected={select._key === n._key}
            />
          )}
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
  select: PropTypes.shape({
    _key: PropTypes.string
  }),
  width: PropTypes.number,
  height: PropTypes.number,
  graph: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired
  }).isRequired,
  actions: PropTypes.shape({
    selectPerimeter: PropTypes.func
  })
}

const mapStatetoProps = (state) => {
  return {
    graph: state.graph,
    select: state.perimeters.select
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      selectPerimeter
    }, dispatch)
  }
}

export default connect(mapStatetoProps, mapDispatchToProps)(EnrichedGrafh)

// ------------------------------------------------------------------------------------------------------ class link

class Node extends Component {
  constructor (props) {
    super(props)
    this.handleOnClick = this.handleOnClick.bind(this)
  }

  handleOnClick (e) {
    this.props.onClick(this.props.data)
  }

  render () {
    const { cx, cy, r, selected } = this.props

    return (
      <g className={styles.node}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          onClick={this.handleOnClick}
          className={[
            selected ? styles.selected : ''
          ].join(' ')}
        />
      </g>
    )
  }
}

Node.propTypes = {
  onClick: PropTypes.func,
  cx: PropTypes.number,
  cy: PropTypes.number,
  r: PropTypes.number,
  data: PropTypes.object,
  selected: PropTypes.bool
}
