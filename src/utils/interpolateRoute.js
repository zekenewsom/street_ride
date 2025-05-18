// Linear interpolation along a polyline
export function interpolateRoute(points, stepMeters = 15) {
    if (points.length < 2) return [];
    const result = [];
    let prev = points[0];
    result.push(prev);
    for (let i = 1; i < points.length; i++) {
      const curr = points[i];
      const dist = haversine(prev, curr);
      const steps = Math.max(1, Math.floor(dist / stepMeters));
      for (let j = 1; j <= steps; j++) {
        const frac = j / steps;
        result.push({
          lat: prev.lat + (curr.lat - prev.lat) * frac,
          lng: prev.lng + (curr.lng - prev.lng) * frac,
        });
      }
      prev = curr;
    }
    return result;
  }
  
  // Haversine distance (meters) between two lat/lng points
  function haversine(a, b) {
    const toRad = (d) => (d * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const aVal =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
    return R * c;
  }
  