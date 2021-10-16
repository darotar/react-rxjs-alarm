import { useState, useEffect } from "react";
import { Button, Stack, Typography } from "@mui/material";

import { ActionTypes, Messages } from "../enums";
import { observable$, dispatch } from "./observable";

export default function Alarm() {
  const [state, setState] = useState<number | Messages>();
  useEffect(() => {
    const sub = observable$.subscribe(setState);

    return () => sub.unsubscribe();
  }, []);

  return (
    <>
      <Typography variant="h5">Alarm Clock</Typography>
      <div className="display">{state}</div>
      <Stack spacing={2} direction="row">
        <Button
          variant="contained"
          color="success"
          onClick={dispatch(ActionTypes.Snooze)}
        >
          Snooze
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={dispatch(ActionTypes.Dismiss)}
        >
          Dismiss
        </Button>
      </Stack>
    </>
  );
}
