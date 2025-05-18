import polyline from '@mapbox/polyline';

export async function fetchRoute(waypoints, travelMode = 'DRIVING') {
  if (waypoints.length < 2) return null;

  const origin = `${waypoints[0].lat},${waypoints[0].lng}`;
  const destination = `${waypoints[waypoints.length - 1].lat},${waypoints[waypoints.length - 1].lng}`;
  const waypts = waypoints
    .slice(1, -1)
    .map((pt) => `${pt.lat},${pt.lng}`)
    .join('|');
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${key}&mode=${travelMode}`;
  if (waypts) url += `&waypoints=${encodeURIComponent(waypts)}`;

  // NOTE: Browsers block calls to the Directions REST API due to CORS,
  // so we'll use the JS API DirectionsService instead, which is supported in the browser.
  return null;
}

// JS API version
export function fetchRouteJS(waypoints, map, travelMode = 'DRIVING') {
  return new Promise((resolve, reject) => {
    if (!window.google || waypoints.length < 2) return resolve(null);

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: waypoints[0],
        destination: waypoints[waypoints.length - 1],
        waypoints:
          waypoints.length > 2
            ? waypoints.slice(1, -1).map((loc) => ({ location: loc, stopover: true }))
            : [],
        travelMode,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === 'OK' && result.routes.length) {
          // Decode all polyline points into array of {lat, lng}
          const points = [];
          result.routes[0].legs.forEach((leg) => {
            leg.steps.forEach((step) => {
              const stepPoints = polyline.decode(step.polyline.points).map(([lat, lng]) => ({ lat, lng }));
              points.push(...stepPoints);
            });
          });
          resolve({
            polyline: points,
            distance: result.routes[0].legs.reduce((sum, leg) => sum + leg.distance.value, 0), // in meters
            duration: result.routes[0].legs.reduce((sum, leg) => sum + leg.duration.value, 0), // in seconds
          });
        } else {
          resolve(null);
        }
      }
    );
  });
}
