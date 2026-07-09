import React from "react";
import Box from "@mui/material/Box";

import { JSON_COLORS } from "../_cons/colors";

// Matches JSON tokens: strings (optionally a key when followed by ":"),
// booleans, null, and numbers.
const JSON_TOKEN_RE =
  /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?)|\b(true|false)\b|\b(null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

// Turn a pretty-printed JSON string into an array of colored React spans.
function highlightJson(json) {
  const nodes = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = JSON_TOKEN_RE.exec(json)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(json.slice(lastIndex, match.index));
    }

    const [token] = match;
    let color;
    if (match[1] !== undefined) {
      color = token.trimEnd().endsWith(":")
        ? JSON_COLORS.key
        : JSON_COLORS.string;
    } else if (match[2] !== undefined) {
      color = JSON_COLORS.boolean;
    } else if (match[3] !== undefined) {
      color = JSON_COLORS.null;
    } else {
      color = JSON_COLORS.number;
    }

    nodes.push(
      <span key={key++} style={{ color }}>
        {token}
      </span>,
    );
    lastIndex = match.index + token.length;
  }

  if (lastIndex < json.length) {
    nodes.push(json.slice(lastIndex));
  }

  return nodes;
}

export default function JsonView({ value }) {
  return (
    <Box
      component="pre"
      sx={{
        p: 2,
        m: 0,
        overflow: "auto",
        maxHeight: 480,
        fontSize: 13,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        bgcolor: "grey.50",
        borderRadius: 1,
      }}
    >
      {highlightJson(JSON.stringify(value, null, 2))}
    </Box>
  );
}
