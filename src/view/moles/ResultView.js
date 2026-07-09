import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { getJSONSizeKB } from "../../nonview/base/json";
import { IMAGE_ALT_FALLBACK, KB_LABEL, MS_LABEL } from "../_cons/content";
import CacheStatusChip from "../atoms/CacheStatusChip";
import JsonView from "../atoms/JsonView";
import ResultImage from "../atoms/ResultImage";

// Prefer the API's absolute `image_url`; fall back to a bundled `image_path`
// (relative to public/, e.g. "_output/.../Image.png").
function getImageUrl(result) {
  if (!result || typeof result !== "object") {
    return undefined;
  }
  if (result.image_url) {
    return result.image_url;
  }
  if (result.image_path) {
    return `${process.env.PUBLIC_URL || ""}/${result.image_path}`;
  }
  return undefined;
}

export default function ResultView({ data, fromCache }) {
  if (!data) {
    return null;
  }

  const { result, command_str: commandStr, query_time_ms: queryTimeMs } = data;
  const imageUrl = getImageUrl(result);
  const jsonSizeKB = getJSONSizeKB(data);

  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", flexWrap: "wrap" }}
        useFlexGap
      >
        <CacheStatusChip fromCache={fromCache} />
        {typeof queryTimeMs === "number" && (
          <Typography variant="caption" color="text.secondary">
            {queryTimeMs} {MS_LABEL}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          {jsonSizeKB.toFixed(1)} {KB_LABEL}
        </Typography>
      </Stack>

      {imageUrl && (
        <ResultImage src={imageUrl} alt={commandStr || IMAGE_ALT_FALLBACK} />
      )}

      <JsonView value={data} />
    </Stack>
  );
}
