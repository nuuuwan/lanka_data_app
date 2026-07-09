import React from "react";
import Box from "@mui/material/Box";

export default function ResultImage({ src, alt }) {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{ maxWidth: "100%", height: "auto", borderRadius: 1 }}
    />
  );
}
