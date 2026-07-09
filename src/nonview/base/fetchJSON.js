// Generic JSON fetch helpers. No repo-specific logic.

// Fetch and parse a JSON body, throwing a clear Error for the common failure
// modes: network/CORS failure, non-2xx status, and non-JSON responses.
export async function fetchJSON(url) {
  let response;
  try {
    response = await fetch(url, { headers: { Accept: "application/json" } });
  } catch (err) {
    // A rejected fetch (TypeError "Failed to fetch") usually means the request
    // never completed at the network level — most often a missing CORS header.
    throw new Error(
      "Could not reach the API. This is usually a CORS issue: the API must " +
        "send an Access-Control-Allow-Origin header for this site.",
    );
  }

  if (!response.ok) {
    throw new Error(
      `Request failed (${response.status} ${response.statusText})`,
    );
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON but received "${contentType || "unknown"}". ` +
        "The API may be temporarily unavailable or protected by a challenge.",
    );
  }

  return response.json();
}

// Like fetchJSON, but returns null instead of throwing when the resource is
// missing or is not JSON (e.g. an index.html fallback for a missing file).
export async function fetchJSONOrNull(url) {
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
