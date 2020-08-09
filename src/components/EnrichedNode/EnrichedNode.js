import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.module.sass'

export class Node extends Component {
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
