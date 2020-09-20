import React from 'react'
import moment from 'moment'
import { TwitterOutlined, SnippetsOutlined } from '@ant-design/icons'
import {
  Avatar,
  Button,
  Typography,
  Divider
} from 'antd'

import { Subject } from '../../models/subject.model'
import styles from './styles.module.sass'
import { useParams } from 'react-router-dom'
import { Store } from '../../store'
import { connect } from 'react-redux'


const { Paragraph } = Typography
const dateFormat = 'YYYY'

interface Props {
  subjects: Subject[]
}

const SubjectInfo = (props: Props) => {
  const { subjectKey } = useParams()
  
  // TODO: check if exist

  const {
    picUrl,
    name,
    lastName,
    birth,
    twitter,
    description,
    campaigns,
    charges,
    academic
  } = props.subjects.find(s => s._key === subjectKey) as Subject

  const buttonTwitter = twitter && (
    <span>
      <Button
        className='btn'
        type='link'
        href={`https://twitter.com/${twitter}`}
        target='_blank'
      >
        {twitter}<TwitterOutlined />
      </Button>
    </span>
  )

  const campaignsSection = !!campaigns?.length && (
    <section className={styles.campaigns}>
      <header>
        Campañas Politicas
      </header>
      <article>
        {
          campaigns
            .map((c) => ({ ...c, date: moment(c.date) }))
            .map((c, i) => (
              <div key={i} className={c.verify ? '' : styles.noverify}>
                <span>{c.elected ? '🔥' : '🏆'}</span>
                <span style={{ width: '55px', marginLeft: '10px' }}>
                  {moment(c.date).format(dateFormat)}
                </span>
                <span style={{ width: '200px', marginLeft: '10px' }}>
                  {c.charge}
                </span>
                <span style={{ width: '126px', marginRight: '10px', textAlign: 'right' }}>
                  ${Math.floor(c.mount / 1000000)} M
                </span>
                <span>
                  <a href='http://example.com'>
                    <SnippetsOutlined />
                  </a>
                </span>
              </div>
            ))
        }
      </article>
    </section>
  )

  const academicSection = !!academic?.length && (
    <section className={styles.campaigns}>
      <header>
        Educacion
      </header>
      <article>
        {
          academic
            .map((c) => ({ ...c, date: moment(c.date) }))
            .map((c, i) => (
              <div key={i} className={c.verify ? '' : styles.noverify}>
                <span style={{ width: '55px' }}>
                  {moment(c.date).format(dateFormat)}
                </span>
                <span style={{ width: '80px', marginLeft: '10px', fontFamily: 'Spectral SC' }}>
                  {c.type}
                </span>
                <span style={{ width: '125px', marginLeft: '10px' }}>
                  {c.entity}
                </span>
                <span style={{ width: '125px', marginLeft: '10px' }}>
                  {c.title}
                </span>
                <span style={{ marginLeft: '10px' }}>
                  <a href='http://example.com'>
                    <SnippetsOutlined />
                  </a>
                </span>
              </div>
            ))
        }
      </article>
    </section>
  )

  const chargesSection = !!charges?.length  && (
    <section className={styles.charges}>
      <header>
        Experiencia Laboral
      </header>
      <article>
        {
          charges
            .map(c => ({
              ...c,
              dateStarted: moment(c.dateStarted),
              dateEnd: moment(c.dateEnd)
            }))
            .map(c => ({
              ...c,
              duration: c.dateEnd.isValid()
                ? c.dateEnd.diff(c.dateStarted, 'days')
                : moment().diff(c.dateStarted, 'days')
            }))
            .sort((a, b) => b.duration - a.duration)
            .slice(0, 3)
            .map((c, i) => (
              <div key={i} className={c.verify ? '' : styles.noverify}>
                <span style={{ width: '55px' }}>
                  {c.dateStarted.format(dateFormat)}
                </span>
                <span style={{ width: '55px', marginLeft: '5px' }}>
                  {c.dateEnd.format(dateFormat)}
                </span>
                <span style={{ width: '190px', marginLeft: '10px' }}>
                  {c.title}
                </span>
                <span style={{ width: '90px', marginLeft: '10px' }}>
                  {c.functionary ? 'funcionario' : ''}
                </span>
                <span style={{ marginLeft: '10px' }}>
                  <a href='http://example.com'>
                    <SnippetsOutlined />
                  </a>
                </span>
              </div>
            ))
        }
      </article>
    </section>
  )

  return (
    <div className={styles.container}>
      <section>
        <header className={styles.header}>
          <figure>
            <Avatar src={picUrl} size={78}>
              {name.charAt(0).concat(lastName.charAt(0))}
            </Avatar>
          </figure>
          <div>
            <span className={styles.name}>{`${name} ${lastName}`}</span>
            <span>{moment(moment()).diff(birth, 'years')} años</span>
            {buttonTwitter}
          </div>
        </header>
        <Paragraph
          className={styles.description}
          ellipsis={{ rows: 3, expandable: true }}
        >
          {description}
        </Paragraph>
      </section>
      {!!campaigns?.length && <Divider />}
      {campaignsSection}
      {!!charges?.length && <Divider />}
      {chargesSection}
      {!!academic?.length && <Divider />}
      {academicSection}
    </div>
  )

}

function mapStateToProps (state: Store) {
  return {
    subjects: state.graph.nodes,
  }
}

export default connect(mapStateToProps)(SubjectInfo)
