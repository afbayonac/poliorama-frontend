import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import styles from './styles.module.sass'
import { Avatar, 
         Button, 
         Typography,
         Divider } from 'antd'
import { TwitterOutlined } from '@ant-design/icons'
const { Paragraph } = Typography

class Perimeter extends Component {
  render () {
    console.log(JSON.stringify(this.props.data, null, 2))

    const { picUrl, name, lastName, birth, twitter, description } = this.props.data
    const buttonTwitter = twitter && (
      <span>
        <Button
          type='link'
          href={`https://twitter.com/${twitter}`}
          target='_blank'>
          {twitter}<TwitterOutlined />
        </Button>
      </span>
    )

    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <figure>
            <Avatar src={picUrl} size={78}>
              {name.charAt(0).concat(lastName.charAt(0))}
            </Avatar>
          </figure>
          <div>
            <span className={styles.name}>{`${name} ${lastName}`}</span>
            <br/>
            <span>{moment(moment()).diff(birth, 'years')} años</span>
            <br/>
            {buttonTwitter}
          </div>
        </header>
        <Paragraph  
          className={styles.description}
          ellipsis={{rows: 3, expandable: true}}>
          {description}
        </Paragraph>
        <Divider />
      </div>
    )
  }
}

Perimeter.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    twitter: PropTypes.string,
    birth: PropTypes.number,
    picUrl: PropTypes.string,
    charges: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        dateStarted: PropTypes.number.isRequired,
      })
    )
  })
}

export default Perimeter
