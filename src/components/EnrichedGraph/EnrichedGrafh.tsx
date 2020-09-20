/* eslint-disable indent */
import React, { useRef, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import * as d3 from 'd3'

import Node from '../EnrichedNode/EnrichedNode'

import { selectSubject } from '../../store/modules/subjects'
import { Store } from 'antd/lib/form/interface'
import { RootActions } from '../../store'
import { Subject } from '../../models/subject.model'
import { useHistory, useLocation } from 'react-router-dom'
import { matchPath } from 'react-router'
import { RouterState } from 'connected-react-router'

interface Props {
  select: {
    _key: string
  }
  width: number
  height: number
  graph: {
    nodes: [any] ,
    links: [any]
  },
  router: RouterState
  actions: {
    selectSubject: typeof selectSubject
  }
}

const EnrichedGrafh = (props: Props) => {
  const { width, height } = props
  

  const [selectKey, setSelectKey] = useState<string>('')
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    const match = matchPath(location.pathname, {
      path: '/subject/:subjectKey',
      exact: true,
      strict: false
    })
    const params: any = match?.params
    setSelectKey((params?.subjectKey) as string)
  }, [location])

  const handleOnClickNode = (e: Subject) => {
    setSelectKey(e._key as string)
    history.push(`/subject/${e._key}`)
  }


  const svgRef = useRef(null)
  const [graph, setGraph] = useState<{ nodes: any[], links: any[]}>({ nodes: [], links: []})
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
    const nodes= props.graph.nodes.map(e => ({
      ...e,
      level: props.graph.links.reduce((c, l) => (l.target === e._key || l.source === e._key) ? c + 1 : c, 0)
    }))

    const links = props.graph.links.map(e => Object.create(e))
  
    d3.forceSimulation()
      .nodes(nodes)
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody().strength((d: any) => d.level > 4 ? -100 : -1).distanceMin(100).distanceMax(100))
      .force('links', d3.forceLink(links).id((e: any) => e._key))
      .force('collide', d3.forceCollide((d: any )=> d.level * 2))
      .on('tick', () => setGraph({ nodes: nodes, links: links}))
  }, [props.graph.links, props.graph.nodes])  // eslint-disable-line react-hooks/exhaustive-deps




  return (
    <svg width={width} height={height} ref={svgRef}>
      <g transform={traslate()}>
        {graph.links.map((l, i) => <line key={i} x1={l.target.x} y1={l.target.y} x2={l.source.x} y2={l.source.y} strokeWidth={0.5} stroke='black' />)}
        {graph.nodes.map((n, i) =>
          <Node
            key={i}
            cx={n.x as number} cy={n.y as number} r={n.level} onClick={handleOnClickNode} data={n}
            selected={selectKey === n._key}
          />
        )}
      </g>
    </svg>
  )
}

const mapStatetoProps = (state: Store) => {
  return {
    graph: state.graph,
    select: state.subject.select,
    router: state.router
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootActions>) => {
  return {
    actions: bindActionCreators({
      selectSubject
    }, dispatch)
  }
}

export default connect(mapStatetoProps, mapDispatchToProps)(EnrichedGrafh)
