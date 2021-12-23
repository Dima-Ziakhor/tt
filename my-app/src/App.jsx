import { useEffect, useState, useCallback } from 'react';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import './App.scss';

const App = () => {
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState('stop');

  useEffect(() => {
    const subject = new Subject();

    interval(1000)
      .pipe(takeUntil(subject))
      .subscribe(() => {
        if (status === 'start') {
          setSeconds(value => value + 1000);
        }
      });

      return () => {
        subject.next();
        subject.complete();
      };
  }, [status]);

  const start = useCallback(() => setStatus('start'), []);

  const wait = useCallback(() => setStatus('wait'), []);

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
            className="App__button"
            onDoubleClick={wait}
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
