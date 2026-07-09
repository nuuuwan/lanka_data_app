import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  COMMAND_FIELDS,
  COMMAND_PLACEHOLDER,
  RUN_LABEL,
} from "../_cons/content";
import CommandField from "../atoms/CommandField";

// The fields are laid out two per row.
const FIELD_ROWS = [COMMAND_FIELDS.slice(0, 2), COMMAND_FIELDS.slice(2, 4)];

export default function CommandForm({
  fields,
  options,
  command,
  loading,
  onFieldChange,
  onRun,
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack spacing={2}>
        {FIELD_ROWS.map((row, rowIndex) => (
          <Stack
            key={rowIndex}
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            {row.map((field) => (
              <CommandField
                key={field.name}
                label={field.label}
                placeholder={field.placeholder}
                options={options[field.name] || []}
                value={fields[field.name]}
                onChange={(value) => onFieldChange(field.name, value)}
              />
            ))}
          </Stack>
        ))}

        <Divider />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontFamily: "monospace", wordBreak: "break-all" }}
          >
            {command || COMMAND_PLACEHOLDER}
          </Typography>
          <Button
            variant="contained"
            onClick={onRun}
            disabled={loading || !command}
            startIcon={
              loading ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {RUN_LABEL}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
