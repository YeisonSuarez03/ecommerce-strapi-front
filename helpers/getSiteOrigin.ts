export function getSiteOrigin() {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }

    return process.env.__NEXT_PRIVATE_ORIGIN;
}