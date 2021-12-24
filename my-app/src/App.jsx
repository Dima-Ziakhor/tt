import { useEffect, useState, useCallback } from 'react';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import './App.scss';

const App = () => {
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState('stop');
  const [timer, setTimer] = useState(300);
  const [isClick, setIsClick] = useState(false);
  const [isClickable, setIsClickable] = useState(false);

  useEffect(() => {
    const subject = new Subject();

    interval(10)
      .pipe(takeUntil(subject))
      .subscribe(() => {
        if (status === 'start' || status === 'waiting') {
          setSeconds(value => value + 10);
        }

        if (status === 'waiting') {
          setTimer(value => value - 10);
        }
      });

      if (timer > 0) {
        setIsClickable(true);
      } else {
        setIsClickable(false);
        setIsClick(false);
        setTimer(300);
      }

      return () => {
        subject.next();
        subject.complete();
      };
  }, [timer, status]);

  const start = useCallback(() => setStatus('start'), []);

  const wait = useCallback(() => {
    setStatus('waiting');
    setIsClick(true);

    if (isClick && isClickable) {
      setStatus('wait');
      setIsClick(false);
      setIsClickable(false);
    }
  }, [isClick, isClickable]);

  const reset = useCallback(() => setSeconds(0), []);


  const stop = useCallback(() => {
    setStatus('stop');
    setSeconds(0);
  }, []);


  return (
    <div className="App">
      <div className="App__wrapper">
        <div className="App__stopwatch">
          {new Date(seconds).toISOString().slice(11, 19)}
        </div>

        <div className="App__buttons">
          <button
            className="App__button"
            onClick={start}
          >
            Start
          </button>

          <button
            className="App__button"
            onClick={stop}
          >
            Stop
          </button>

          <button
            id="wait"
            className="App__button"
            onClick={() => {
              wait();
              console.log(isClick, isClickable)
            }}
          >
            Wait
          </button>

          <button
            className="App__button"
            onClick={reset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
