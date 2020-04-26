import React, { Component } from 'react'
import PropTypes from 'prop-types'

class PerimeterView extends Component {
  render () {
    return (<pre>{JSON.stringify(this.props.data, null, 2)}</pre>)
  }
}

PerimeterView.propTypes = {
  data: PropTypes.object
}

export default PerimeterView
