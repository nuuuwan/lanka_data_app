// Minimal client for the Lanka Data API.
//
// The API exposes a single "one API to rule them all" grammar:
//
//   What / When / Where / How
//
// e.g. "Religion/2012-2024/LK:district/Map:Change".
//
// The same command string is the URL path, so a request is simply a GET to
// `${API_BASE}/${command}`. Every response is JSON with the shape:
//   { command_str, result, sources, query_time_ms }
//
// See https://github.com/nuuuwan/lanka_data for the full grammar.

// The API (https://lanka-data-phi.vercel.app) does not send CORS headers, so a
// browser cannot read its responses cross-origin. To work around this during
// local development, requests go through the CRA dev-server proxy (see
// src/setupProxy.js) under the `/api` prefix, which makes them same-origin.
//
// The dev base is anchored to `window.location.origin` (not a bare "/api")
// because the app may be served under a base path (e.g. "/lanka_data_app/");
// anchoring to the origin guarantees requests hit "<origin>/api/..." and are
// caught by the proxy, instead of being resolved to "/lanka_data_app/api/...".
//
// In production (a static GitHub Pages build) there is no proxy, so the app
// calls the API directly. For that to work the API MUST send CORS headers
// (add a vercel.json with Access-Control-Allow-Origin in the lanka_data repo).
export const API_BASE =
  process.env.NODE_ENV === "development"
    ? `${window.location.origin}/api`
    : "https://lanka-data-phi.vercel.app";

// Encode each field of the command path separately so that operators used in
// the grammar (":", ",", "@", "+", "...") survive, while spaces and other
// unsafe characters are escaped. encodeURIComponent escapes these operators
// (e.g. ":" -> "%3A"), but the API expects them literally (an encoded ":"
// returns HTTP 400), so we restore them after encoding.
function encodeCommand(command) {
  return command
    .split("/")
    .map((field) =>
      encodeURIComponent(field)
        .replace(/%3A/gi, ":")
        .replace(/%2C/gi, ",")
        .replace(/%40/gi, "@")
        .replace(/%2B/gi, "+"),
    )
    .join("/");
}

export function buildCommand({ what, when, where, how }) {
  return [what, when, where, how]
    .map((field) => (field || "").trim())
    .filter((field) => field.length > 0)
    .join("/");
}

export async function runCommand(command) {
  const url = `${API_BASE}/${encodeCommand(command)}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(
      `Request failed (${response.status} ${response.statusText})`,
    );
  }

  // The API can return a non-JSON response (e.g. an HTML bot-challenge or
  // error page from the host) even with a 2xx status. Detect that here so
  // callers get a clear message instead of a cryptic JSON.parse error.
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON but received "${contentType || "unknown"}". ` +
        "The API may be temporarily unavailable or protected by a challenge.",
    );
  }

  return response.json();
}

// Persistent cache for API responses, keyed by command string, so repeated
// requests for the same command are served from localStorage instead of
// hitting the API again.
const CACHE_PREFIX = "lanka_data_cache:";

// Pre-computed results bundled with the app live under public/_output, at
// "<command>/Output.json". Serving these avoids calling the API entirely.
const STATIC_OUTPUT_BASE = `${process.env.PUBLIC_URL || ""}/_output`;

// Try to load a pre-computed result bundled in public/_output. Returns the
// parsed data if present, or null if there is no bundled result for this
// command. A non-JSON response (e.g. the dev server's index.html fallback for
// a missing file) is treated as "not found".
async function fetchStaticResult(command) {
  const url = `${STATIC_OUTPUT_BASE}/${encodeCommand(command)}/Output.json`;
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      return null;
    }
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return null;
    }
    return await response.json();
  } catch (err) {
    return null;
  }
}

// Run a command, using cached results when available. Resolution order:
//   1. localStorage cache (previously fetched this session/browser)
//   2. results bundled with the app in public/_output
//   3. the live API
// Returns the response data along with `fromCache`, indicating whether it came
// from a cache/bundle (true) or was freshly fetched from the API (false).
export async function runCommandCached(command) {
  const cacheKey = CACHE_PREFIX + command;

  try {
    const cached = window.localStorage.getItem(cacheKey);
    if (cached !== null) {
      return { data: JSON.parse(cached), fromCache: true };
    }
  } catch (err) {
    // Ignore unreadable/corrupt cache entries and fall through to fetching.
  }

  const staticData = await fetchStaticResult(command);
  if (staticData !== null) {
    return { data: staticData, fromCache: true };
  }

  const data = await runCommand(command);

  try {
    window.localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (err) {
    // Ignore write failures (e.g. storage full or disabled); the request
    // still succeeds, it just won't be cached.
  }

  return { data, fromCache: false };
}

// The "Help" command returns the available options for each field. It is
// cached like any other command to minimise API calls.
export async function fetchHelp() {
  const { data } = await runCommandCached("Help");
  return data.result;
}
