/**
 * authFetch — A drop-in replacement for the native `fetch()` that automatically
 * dispatches a 'auth:session-expired' event when a 401 Unauthorized is received.
 *
 * Usage: Replace `fetch(url, options)` with `authFetch(url, options)` in any
 * component that calls a protected API endpoint.
 */
export async function authFetch(url, options = {}) {
  const response = await fetch(url, options);

  if (response.status === 401) {
    // Dispatch a global event so AuthContext can show the session expired popup
    window.dispatchEvent(new Event('auth:session-expired'));
  }

  return response;
}
