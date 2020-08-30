/* eslint-disable indent */
import React, { useRef, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import * as d3 from 'd3'

import Node from '../EnrichedNode/EnrichedNode'

import { selectPerimeter } from '../../store/modules/perimeters'
import { object } from 'prop-types'
import { Store } from 'antd/lib/form/interface'
import { RootActions } from '../../store'

interface Props {
  select: {
    _key: string
  }
  width: number
  height: number
  graph: {
    nodes: [any],
    links: [any]
  },
  actions: {
    selectPerimeter: typeof selectPerimeter
  }
}

const EnrichedGrafh = (props: Props) => {
  const { width, height, select } = props

  const svgRef = useRef(null)
  
  const [graph, setGraph] = useState({
    nodes: props.graph.nodes.map(e => ({
      ...e,
      level: props.graph.links.reduce((c, l) => (l.target === e._key || l.source === e._key) ? c + 1 : c, 0)
    })),
    links: props.graph.links.map(e => Object.create(e))
  })

  const [zoomed, setZoomed] = useState({x:0, y:0, k:1})

  useEffect(() => {
    const zoom = d3.zoom()
    .scaleExtent([1, -1])
    .scaleExtent([-5, 5])
    .on('zoom', () => setZoomed({ ...d3.event.transform }))
  
    d3.select(svgRef.current).call(zoom as any)
  }, [])
  
  
  const  traslate = () =>  {
    const { x, y, k } = zoomed
    return `translate(${x}, ${y}) scale(${k})`
  }
  
  
  useEffect(() => {
    d3.forceSimulation()
      .nodes(graph.nodes)
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody().strength((d: any) => d.level > 4 ? -100 : -1).distanceMin(100).distanceMax(100))
      .force('links', d3.forceLink(graph.links).id((e: any) => e._key))
      .force('collide', d3.forceCollide((d: any )=> d.level * 2))
      .on('tick', () => setGraph({ nodes: graph.nodes, links: graph.links}))
  }, [])


  const handleOnClickNode = (e: any) => {
    props.actions.selectPerimeter(e)
  }


  return (
    <svg width={width} height={height} ref={svgRef}>
      <g transform={traslate()}>
        {graph.links.map((l, i) => <line key={i} x1={l.target.x} y1={l.target.y} x2={l.source.x} y2={l.source.y} strokeWidth={0.5} stroke='black' />)}
        {graph.nodes.map((n, i) =>
          <Node
            key={i}
            cx={n.x as number} cy={n.y as number} r={n.level} onClick={handleOnClickNode} data={n}
            selected={select && select._key === n._key}
          />
        )}
      </g>
    </svg>
  )
}



const mapStatetoProps = (state: Store) => {
  return {
    graph: state.graph,
    select: state.perimeters.select
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootActions>) => {
  return {
    actions: bindActionCreators({
      selectPerimeter
    }, dispatch)
  }
}

export default connect(mapStatetoProps, mapDispatchToProps)(EnrichedGrafh)
