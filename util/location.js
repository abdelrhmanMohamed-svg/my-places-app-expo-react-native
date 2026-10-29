// OpenStreetMap Nominatim reverse geocoding
// Complies with OSM policy by providing User-Agent and requesting only on explicit user actions
export async function getAddress(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MyPlacesApp-ReactNative/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch address!');
    }

    const data = await response.json();
    if (!data || !data.display_name) {
      return `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
    }

    return data.display_name;
  } catch (error) {
    console.warn('Geocoding error:', error);
    return `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
  }
}
