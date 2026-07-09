import React from "react";
import BoltIcon from "@mui/icons-material/Bolt";
import CachedIcon from "@mui/icons-material/Cached";
import Chip from "@mui/material/Chip";

import { CACHE_LABEL, HOT_LABEL } from "../_cons/content";

export default function CacheStatusChip({ fromCache }) {
  return (
    <Chip
      size="small"
      icon={fromCache ? <CachedIcon /> : <BoltIcon />}
      label={fromCache ? CACHE_LABEL : HOT_LABEL}
      color={fromCache ? "default" : "success"}
      variant={fromCache ? "outlined" : "filled"}
    />
  );
}
