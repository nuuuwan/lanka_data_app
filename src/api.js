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

export const API_BASE = 'https://lanka-data-phi.vercel.app';

// Encode each field of the command path separately so that operators used in
// the grammar (":", ",", "@", "...") survive, while spaces and other unsafe
// characters are escaped.
function encodeCommand(command) {
  return command
    .split('/')
    .map((field) => encodeURIComponent(field))
    .join('/');
}

export function buildCommand({ what, when, where, how }) {
  return [what, when, where, how]
    .map((field) => (field || '').trim())
    .filter((field) => field.length > 0)
    .join('/');
}

export async function runCommand(command) {
  const url = `${API_BASE}/${encodeCommand(command)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status} ${response.statusText})`);
  }
  return response.json();
}

// The "Help" command returns the available options for each field.
export async function fetchHelp() {
  const data = await runCommand('Help');
  return data.result;
}
