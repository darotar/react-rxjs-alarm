import { Divider } from "@mui/material";

import Alarm from "./Alarm";
import Autocomplete from "./Autocomplete";

import "./App.css";

export default function App() {
  return (
    <>
      <Alarm />
      <Divider sx={{ my: 3 }} />
      <Autocomplete />
    </>
  );
}
