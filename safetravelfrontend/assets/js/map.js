// Google Maps loader and helpers with graceful fallback.
window.maps = (function(){
  let map, markers = [];
  const loadScript = () => new Promise((resolve, reject)=>{
    if (window.google && window.google.maps) return resolve();
    const key = window.GOOGLE_MAPS_KEY || 'YOUR_API_KEY';
    const s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=' + key;
    s.async = true; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });

  const iconFor = (type) => {
    const colors = { Earthquake:'#dc3545', Flood:'#0d6efd', Cyclone:'#6f42c1', Wildfire:'#fd7e14' };
    const color = colors[type] || '#0d6efd';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><circle cx="14" cy="14" r="10" fill="${color}" fill-opacity="0.18"/><circle cx="14" cy="14" r="6" fill="${color}"/></svg>`;
    return () => {
      if (!window.google || !google.maps) return null;
      return { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), scaledSize: new google.maps.Size(28,28) };
    };
  };

  async function ensure(){ try { await loadScript(); } catch { console.warn('Maps failed to load'); } }

  async function initMap(elId, center, zoom){
    const el = document.getElementById(elId);
    if (!(window.google && window.google.maps)) {
      el.innerHTML = '<div class="p-4 text-center text-muted">Map unavailable (API key missing).</div>';
      el.classList.add('d-flex','align-items-center','justify-content-center');
      return null;
    }
    map = new google.maps.Map(el, { center, zoom, mapId: 'bf8d1b1b2c4d1a12' });
    return map;
  }

  function setMarkers(items){
    clearMarkers();
    if (!(window.google && window.google.maps && map)) return;
    items.forEach(it=>{
      const iconFactory = typeof it.icon === 'function' ? it.icon : null;
      const icon = iconFactory ? iconFactory() : undefined;
      const m = new google.maps.Marker({ position: it.position, map, title: it.title, icon });
      markers.push(m);
    });
  }
  function clearMarkers(){ markers.forEach(m => m.setMap(null)); markers = []; }

  return {
    ensure,
    initMap,
    setMarkers,
    clearMarkers,
    iconFor: (type) => {
      const f = iconFor(type);
      return f();
    }
  };
})();
