// The Lanka Data command grammar: What / When / Where / How, joined by "/".

// Build a command string from field values, dropping empty fields.
export function buildCommand({ what, when, where, how }) {
  return [what, when, where, how]
    .map((field) => (field || "").trim())
    .filter((field) => field.length > 0)
    .join("/");
}

// Encode a command as a URL path. Grammar operators (":", ",", "@", "+") are
// kept literal because the API rejects their percent-encoded forms (an encoded
// ":" returns HTTP 400), while spaces and other unsafe characters are escaped.
export function encodeCommand(command) {
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

// Parse a location pathname (basename already stripped by the router) into a
// command string, decoding each segment so operators like ":" survive.
export function parseCommandFromPath(pathname) {
  return pathname
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch (err) {
        return segment;
      }
    })
    .filter((segment) => segment.length > 0)
    .join("/");
}

// Split a command string into the four form fields.
export function commandToFields(command) {
  const [what = "", when = "", where = "", ...rest] = command.split("/");
  return { what, when, where, how: rest.join("/") };
}
