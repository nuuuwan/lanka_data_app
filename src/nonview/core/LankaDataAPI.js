import { fetchJSON, fetchJSONOrNull } from "../base/fetchJSON";
import { getCached, setCached } from "../base/LocalStorageCache";
import {
  API_BASE,
  CACHE_PREFIX,
  HELP_COMMAND,
  STATIC_OUTPUT_BASE,
} from "../cons";
import { encodeCommand } from "./Command";

// Client for the Lanka Data API. The API exposes a single grammar,
// What / When / Where / How, where the command string is also the URL path.
// Every response has the shape { command_str, result, sources, query_time_ms }.
// See https://github.com/nuuuwan/lanka_data for the full grammar.

// Fetch a command result from the live API.
export async function runCommand(command) {
  return fetchJSON(`${API_BASE}/${encodeCommand(command)}`);
}

// Load a pre-computed result bundled in public/_output, or null if none exists.
async function fetchStaticResult(command) {
  return fetchJSONOrNull(
    `${STATIC_OUTPUT_BASE}/${encodeCommand(command)}/Output.json`,
  );
}

// Resolve a command, preferring caches over the API. Resolution order:
//   1. localStorage cache   2. bundled public/_output   3. live API
// Returns { data, fromCache }, where fromCache is true for a cache/bundle hit.
export async function runCommandCached(command) {
  const cacheKey = CACHE_PREFIX + command;

  const cached = getCached(cacheKey);
  if (cached !== undefined) {
    return { data: cached, fromCache: true };
  }

  const staticData = await fetchStaticResult(command);
  if (staticData !== null) {
    return { data: staticData, fromCache: true };
  }

  const data = await runCommand(command);
  setCached(cacheKey, data);
  return { data, fromCache: false };
}

// The "Help" command lists the available options for each field.
export async function fetchHelp() {
  const { data } = await runCommandCached(HELP_COMMAND);
  return data.result;
}
