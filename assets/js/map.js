// map.js - lightweight map helper (Leaflet)
window.datsMap = (function(){
  let mapInstance = null;
  let markers = [];

  function init(elId='map', center=[20.5937,78.9629], zoom=5) {
    const el = document.getElementById(elId);
    if (!el) return null;
    // if already init, return
    if (mapInstance) { mapInstance.invalidateSize(); return mapInstance; }

    mapInstance = L.map(elId).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);
    return mapInstance;
  }

  function clearMarkers() {
    markers.forEach(m => m.remove());
    markers = [];
  }

  function addAlertMarkers(alerts) {
    if (!mapInstance) return;
    clearMarkers();
    alerts.forEach(a => {
      const color = a.severity === 'High' ? '#ff6b6b' : a.severity === 'Moderate' ? '#ffb86b' : '#7ee7a6';
      const marker = L.circleMarker([a.lat, a.lon], {
        radius: 8, fillColor: color, color: color, fillOpacity:0.9
      }).addTo(mapInstance);
      marker.bindPopup(`<b>${a.type}</b><br>${a.message}<br><small class="muted">Severity: ${a.severity}</small>`);
      markers.push(marker);
    });
  }

  function addMarker(lat, lon, label) {
    if (!mapInstance) return;
    const m = L.marker([lat, lon]).addTo(mapInstance);
    if (label) m.bindPopup(label).openPopup();
    markers.push(m);
    mapInstance.setView([lat, lon], Math.max(mapInstance.getZoom(), 8));
  }

  return { init, addAlertMarkers, addMarker, clearMarkers, mapInstance: () => mapInstance };
})();
