import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

export default function Searchbox({ placeholder, onChange }) {
  return (
    <TextField
      variant="outlined"
      placeholder={placeholder}
      onChange={onChange}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{
        backgroundColor: "white",
        borderRadius: "4px",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "var(--dull)",
          },
          "&:hover fieldset": {
            borderColor: "var(--secondary)",
          },
        },
      }}
    />
  );
}
