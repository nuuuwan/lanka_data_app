// Non-UI constants for the Lanka Data client.

// API base URL. In development, requests go through the CRA dev-server proxy
// (src/setupProxy.js) at "<origin>/api" to avoid CORS; in production the app
// calls the API directly.
export const API_BASE =
  process.env.NODE_ENV === "development"
    ? `${window.location.origin}/api`
    : "https://lanka-data-phi.vercel.app";

// localStorage key prefix for cached API responses.
export const CACHE_PREFIX = "lanka_data_cache:";

// Pre-computed results bundled with the app live under public/_output.
export const STATIC_OUTPUT_BASE = `${process.env.PUBLIC_URL || ""}/_output`;

// Command that lists the available options for each field.
export const HELP_COMMAND = "Help";

// Command shown when the app first loads.
export const DEFAULT_COMMAND = {
  what: "Religion",
  when: "2024",
  where: "LK",
  how: "JSON",
};
