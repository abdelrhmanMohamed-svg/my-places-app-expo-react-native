export function getLeafletHtml(lat = 37.78825, lng = -122.4324, isPicker = true) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: #e5e3df;
          }
          .leaflet-control-attribution {
            font-size: 9px;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const initialLat = ${Number(lat)};
          const initialLng = ${Number(lng)};
          const isPicker = ${Boolean(isPicker)};

          const map = L.map('map', {
            zoomControl: isPicker,
            attributionControl: false,
            dragging: isPicker,
            touchZoom: isPicker,
            scrollWheelZoom: false,
            doubleClickZoom: isPicker,
            boxZoom: isPicker
          }).setView([initialLat, initialLng], 14);

          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
          }).addTo(map);

          let marker = L.marker([initialLat, initialLng]).addTo(map);

          // Force Leaflet to re-calculate container dimensions once WebView layout settles
          setTimeout(function() {
            map.invalidateSize();
          }, 200);
          setTimeout(function() {
            map.invalidateSize();
          }, 500);

          if (isPicker) {
            map.on('click', function(e) {
              const clickedLat = e.latlng.lat;
              const clickedLng = e.latlng.lng;
              if (marker) {
                marker.setLatLng([clickedLat, clickedLng]);
              } else {
                marker = L.marker([clickedLat, clickedLng]).addTo(map);
              }
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'LOCATION_SELECTED',
                  lat: clickedLat,
                  lng: clickedLng
                }));
              }
            });
          }

          // In case coordinates update from parent
          window.addEventListener('message', function(event) {
            try {
              const data = JSON.parse(event.data);
              if (data.type === 'SET_LOCATION') {
                map.setView([data.lat, data.lng], 15);
                if (marker) {
                  marker.setLatLng([data.lat, data.lng]);
                } else {
                  marker = L.marker([data.lat, data.lng]).addTo(map);
                }
              }
            } catch (err) {}
          });
        </script>
      </body>
    </html>
  `;
}
