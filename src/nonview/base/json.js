// Size, in kilobytes, of the UTF-8 JSON serialization of a value.
export function getJSONSizeKB(value) {
  return new TextEncoder().encode(JSON.stringify(value)).length / 1024;
}
