export function encodeWaypoints(waypoints) {
    return btoa(encodeURIComponent(JSON.stringify(waypoints)));
  }
  export function decodeWaypoints(str) {
    try {
      return JSON.parse(decodeURIComponent(atob(str)));
    } catch {
      return [];
    }
  }
  