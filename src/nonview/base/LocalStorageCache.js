// Generic JSON-in-localStorage cache, resilient to disabled/broken storage.

// Return the parsed value stored at `key`, or undefined if absent/unreadable.
export function getCached(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch (err) {
    return undefined;
  }
}

// Store `value` (serialized as JSON) at `key`. Write failures are ignored.
export function setCached(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Ignore write failures (e.g. storage full or disabled).
  }
}
