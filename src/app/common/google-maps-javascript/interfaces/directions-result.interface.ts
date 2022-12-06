export interface DirectionsResultI
{
  available_travel_modes?: any;
  /**
   * An array of <code>DirectionsGeocodedWaypoint</code>s, each of which
   * contains information about the geocoding of origin, destination and
   * waypoints.
   */
  geocoded_waypoints?: any;
  /**
   * An array of <code>DirectionsRoute</code>s, each of which contains
   * information about the legs and steps of which it is composed. There will
   * only be one route unless the <code>DirectionsRequest</code> was made with
   * <code>provideRouteAlternatives</code> set to <code>true</code>.
   */
  routes: any;
}
