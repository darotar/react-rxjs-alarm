import { ChangeEvent, useEffect, useState, KeyboardEvent } from "react";
import { TextField, Paper, MenuItem, Typography } from "@mui/material";

import { subject$, getSuggestions } from "./suggestionService";
import { Suggestion } from "./types";

enum Keys {
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
  Enter = "Enter",
}

const itemStyle = { overflow: "hidden", textOverflow: "ellipsis" };
const wrapperStyle = { width: "400px" };

export default function Autocomplete() {
  const [value, setValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [highlightedIdx, setHighlightedIdx] = useState<number>(0);

  useEffect(() => {
    const valueSubscription = subject$.subscribe({
      next: setValue,
      error: console.error,
    });

    const suggestionSubscription = getSuggestions(subject$).subscribe({
      next: setSuggestions,
      error: console.error,
    });

    return () => {
      valueSubscription.unsubscribe();
      suggestionSubscription.unsubscribe();
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    subject$.next(e.target.value);

  const handleSelect = (idx: number) => () => {
    console.log(suggestions[idx]);

    setSuggestions([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const INITIAL_IDX = 0;

    if (e.code === Keys.ArrowDown) {
      e.preventDefault();

      const idx = highlightedIdx;
      const nextIdx = idx !== undefined ? idx + 1 : INITIAL_IDX;

      if (nextIdx < suggestions.length) {
        setHighlightedIdx(nextIdx);
      } else {
        setHighlightedIdx(INITIAL_IDX);
      }
    }

    if (e.code === Keys.ArrowUp) {
      e.preventDefault();

      const lastIdx = suggestions.length - 1;
      const idx = highlightedIdx;
      const prevIdx = idx !== undefined ? idx - 1 : lastIdx;

      if (prevIdx >= 0) {
        setHighlightedIdx(prevIdx);
      } else {
        setHighlightedIdx(lastIdx);
      }
    }

    if (e.code === Keys.Enter && highlightedIdx !== undefined) {
      handleSelect(highlightedIdx)();
    }
  };

  const renderSuggestion = ({ name, symbol }: Suggestion, idx: number) => {
    return (
      <MenuItem
        key={`suggestion-${idx}`}
        onClick={handleSelect(idx)}
        selected={highlightedIdx === idx}
      >
        <Typography variant="body1" sx={itemStyle}>
          {symbol} - {name}
        </Typography>
      </MenuItem>
    );
  };

  const shouldShowSuggestions = !!suggestions.length && value.length > 2;

  return (
    <div style={wrapperStyle}>
      <Typography variant="h5">Autocomplete</Typography>
      <TextField
        fullWidth
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={value}
        placeholder="Start Typing"
      />
      {!!shouldShowSuggestions && (
        <Paper>{suggestions.map(renderSuggestion)}</Paper>
      )}
    </div>
  );
}
