import { useState, useEffect, FC } from "react";

import { observable$, dispatch } from "./observable";
import { ActionTypes, Messages } from "./enums";

import "./App.css";

const App: FC<{}> = () => {
  const [state, setState] = useState<number | Messages>();

  useEffect(() => {
    const sub = observable$.subscribe(setState);

    return () => sub.unsubscribe();
  }, []);

  return (
    <div className="App">
      <h3>Alarm Clock</h3>
      <div className="display">{state}</div>
      <button className="snooze" onClick={dispatch(ActionTypes.Snooze)}>
        Snooze
      </button>
      <button className="dismiss" onClick={dispatch(ActionTypes.Dismiss)}>
        Dismiss
      </button>
    </div>
  );
};

export default App;
