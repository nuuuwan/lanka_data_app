import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function CommandField({
  label,
  placeholder,
  options,
  value,
  onChange,
}) {
  return (
    <Autocomplete
      freeSolo
      fullWidth
      options={options}
      value={value}
      onChange={(event, next) => onChange(next || "")}
      onInputChange={(event, next) => onChange(next)}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
    />
  );
}
