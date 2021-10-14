import { useState, useEffect } from 'react';

import { observable$, dispatch } from './observable';
import actionTypes from './actionTypes';

import './App.css'

function App() {
  const [state, setState] = useState();

  useEffect(() => {
    const sub = observable$.subscribe(setState);

    return () => sub.unsubscribe();
  }, []);

  return (
    <div className="App">
      <h3>Alarm Clock</h3>
      <div className="display">{state}</div>
      <button className="snooze" onClick={dispatch(actionTypes.Snooze)}>
        Snooze
      </button>
      <button className="dismiss" onClick={dispatch(actionTypes.Dismiss)}>
        Dismiss
      </button>
    </div>
  );
}

export default App;
