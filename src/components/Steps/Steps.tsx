import React from 'react'

import styles from './styles.module.sass'

interface Props {
  step: number
  steps: string[]
  changeStep: (s: number) => void
}

const Steps = (props: Props) => {

  const updateStep = (i: number): void  => {
    props.changeStep(i)
  }

  return (
    <div className={styles.steper}>
      { 
        props.steps.map((s, i) => 
          <span 
            key={s} 
            className={props.step === i ? styles.selected : ''}
            onClick={() => updateStep(i)}  
          >
            {s}
          </span>) 
      }
    </div>
  )
}

export default Steps
