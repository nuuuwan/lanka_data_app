import React from "react";
import BoltIcon from "@mui/icons-material/Bolt";
import CachedIcon from "@mui/icons-material/Cached";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// Colors for the different JSON token types (tuned for the light background).
const JSON_COLORS = {
  key: "#0b6e4f",
  string: "#b7472a",
  number: "#1f6feb",
  boolean: "#8250df",
  null: "#6e7781",
};

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

function JsonBlock({ value }) {
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

export default function ResultView({ data, fromCache }) {
  if (!data) {
    return null;
  }

  const { result, query_time_ms: queryTimeMs } = data;
  // Prefer the API's absolute `image_url`; fall back to a bundled `image_path`
  // (relative to public/, e.g. "_output/.../Image.png").
  let imageUrl;
  if (result && typeof result === "object") {
    if (result.image_url) {
      imageUrl = result.image_url;
    } else if (result.image_path) {
      imageUrl = `${process.env.PUBLIC_URL || ""}/${result.image_path}`;
    }
  }

  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", flexWrap: "wrap" }}
        useFlexGap
      >
        <Chip
          size="small"
          icon={fromCache ? <CachedIcon /> : <BoltIcon />}
          label={fromCache ? "Cache" : "Hot"}
          color={fromCache ? "default" : "success"}
          variant={fromCache ? "outlined" : "filled"}
        />
        {typeof queryTimeMs === "number" && (
          <Typography variant="caption" color="text.secondary">
            {queryTimeMs} ms
          </Typography>
        )}
      </Stack>

      {imageUrl && (
        <Box
          component="img"
          src={imageUrl}
          alt={data.command_str || "Result image"}
          sx={{ maxWidth: "100%", height: "auto", borderRadius: 1 }}
        />
      )}

      <JsonBlock value={data} />
    </Stack>
  );
}
