import React, { Dispatch, FormEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { add, ClockState, remove, selectClock } from './clockSlice';

import styles from './Clocker.module.css';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../app/store';

// export function Clocker() {
//   const state = useAppSelector(selectClock);
//   const dispatch = useAppDispatch();

  // const timings = state.timings.map( (timestamp, i) => <div key={timestamp} className={(i%2) === 0 ? styles.timestampIn : styles.timestampOut}>
  //   <span>{formatTimestamp(timestamp)}</span>
  //   <button
  //       className={styles.button}
  //       aria-label="Increment value"
  //       onClick={() => dispatch(remove(timestamp))}
  //     >
  //       -
  //     </button>
  // </div>)

  // return (<section className={styles.clocker}>
  //   <form onSubmit={(evt) => {submitForm(evt, dispatch)}} className={styles.clockerInput}>
  //     <input id='time' name='time' placeholder='now'></input>
  //     <button type="submit" className={styles.button} aria-label="Add Timing">+</button>
  //   </form>
  //   <div className="clocker-listing">
  //     {timings}
  //   </div>
  //   <div className={styles.calc}>
  //     {timeWorked(state.timings)}
  //   </div>
  // </section>);
// }

interface StateProps extends ClockState {
  now: Number,
}

interface DispatchProps {
  add: (timestamp: number) => void,
  remove: (timestamp: number) => void,
}

interface OwnProps {
  backgroundColor: string
}

type Props = StateProps & DispatchProps & OwnProps

const mapState = (state: RootState) => ({
  timings: state.clock.timings,
  now: Date.now(),
})

class Clocker extends React.Component {
  private timerID: any;

  constructor(public props: Props) {
    super(props);
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      try {
        this.doTick();
      } catch(err: any) {
        console.debug(err);
      }
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  doTick() {
    const state = {...this.state, now: Date.now()};

    this.setState(state);
  }

  submitForm(evt:FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const input: HTMLInputElement = evt.currentTarget.children.namedItem('time') as HTMLInputElement;
    if (input !== null && input.value !== '') {
      let d = new Date();
      const [hours, minutes, seconds] = input.value.split(/[:-]/)

      d.setHours(parseInt(hours) || 0);
      d.setMinutes(parseInt(minutes)|| 0);
      d.setSeconds(parseInt(seconds)|| 0);
      d.setMilliseconds(0);

      this.props.add(d.getTime());
    } else {
      this.props.add(Date.now());
    }

    input.value = '';

    return false;
  }
  formatTimestamp(timestamp: number) {
    const d = new Date(timestamp);
  
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
  }

  timeWorked(tmn: number[]) {
    const timings = tmn.slice();
    if (timings.length % 2 > 0) {
      timings.push(Date.now());
    }
    const zero = new Date();
    zero.setHours(0);
    zero.setMinutes(0);
    zero.setSeconds(0);
  
    let stamp = zero.getTime();
    timings.reverse().forEach((val, i, src) => {
      if (i%2 === 1) {
        stamp += src[i-1] - src[i];
      }
    })
    
    return <span>{this.formatTimestamp(stamp)}</span>
  }

  render() {
    const timings = this.props.timings.map( (timestamp, i) => <div key={timestamp} className={(i%2) === 0 ? styles.timestampIn : styles.timestampOut}>
    <span>{this.formatTimestamp(timestamp)}</span>
    <button
        className={styles.button}
        aria-label="Increment value"
        onClick={() => this.props.remove(timestamp)}
      >
        -
      </button>
  </div>)

    return (<section className={styles.clocker}>
      <form onSubmit={(evt) => {this.submitForm(evt)}} className={styles.clockerInput}>
        <input id='time' name='time' placeholder='now'></input>
        <button type="submit" className={styles.button} aria-label="Add Timing">+</button>
      </form>
      <div className="clocker-listing">
        {timings}
      </div>
      <div className={styles.calc}>
        {this.timeWorked(this.props.timings)}
      </div>
    </section>)
  }
}

// @ts-ignore
export default connect<null, DispatchProps>(mapState, {add, remove}, null)(Clocker);