import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles.module.sass'

interface Props {
  onClick: Function
  cx: number
  cy: number
  r: number
  data: object
  selected: Boolean
}

const Node: React.FC<Props> = (props) =>  {
  const { cx, cy, r, selected } = props
  
  const handleOnClick = () => {
    props.onClick(props.data)
  }
  
  return (
    <g className={styles.node}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        onClick={handleOnClick}
        className={[
          selected ? styles.selected : ''
        ].join(' ')}
      />
    </g>
  )
}

Node.propTypes = {
  onClick: PropTypes.func.isRequired,
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  r: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired
}

Node.defaultProps = {
  selected: false
}

export default Node