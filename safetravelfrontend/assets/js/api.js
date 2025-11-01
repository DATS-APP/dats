// Optional: set window.API_BASE = '/api' before this file to connect to backend.
const API_BASE = window.API_BASE || '';

window.api = {
  async checkSafety({ destination, date }) {
    try {
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/safety`, {
          method: 'POST', headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ destination, date })
        });
        if (!res.ok) throw new Error('Bad response');
        return await res.json();
      }
    } catch (e) { /* mock fallback */ }
    const risk = ['Safe','Moderate','High'][Math.floor(Math.random()*3)];
    const descs = {
      Safe: 'No significant active alerts. Standard precautions recommended.',
      Moderate: 'Some alerts nearby. Monitor updates and keep flexible plans.',
      High: 'Severe active alerts detected. Consider postponing travel.'
    };
    return {
      risk,
      description: descs[risk],
      recentAlerts: [
        { type:'Flood', severity: Math.random()>0.5?'Moderate':'Advisory', when:'2h ago' },
        { type:'Cyclone', severity:'Watch', when:'6h ago' }
      ]
    };
  },

  async getLiveAlerts(layer='all') {
    try {
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/alerts?layer=${encodeURIComponent(layer)}`);
        if (!res.ok) throw new Error('Bad response');
        return await res.json();
      }
    } catch (e) { /* mock */ }
    const now = new Date().toISOString();
    const data = [
      { id:1, type:'Earthquake', lat:19.07, lng:72.88, severity:'Light', time: now },
      { id:2, type:'Flood', lat:28.61, lng:77.21, severity:'Severe', time: now },
      { id:3, type:'Wildfire', lat:13.08, lng:80.27, severity:'Moderate', time: now },
      { id:4, type:'Cyclone', lat:22.57, lng:88.36, severity:'Watch', time: now }
    ];
    return data.filter(a => layer==='all' ? true : a.type.toLowerCase()===layer);
  },

  async findSafeRoutes({ origin, destination, mode }) {
    try {
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/routes`, {
          method: 'POST', headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ origin, destination, mode })
        });
        if (!res.ok) throw new Error('Bad response');
        return await res.json();
      }
    } catch (e) { /* mock */ }
    return {
      options: [
        { risk:'Safe', duration:'1h 15m', distance:'62 km', summary:'Expressway avoiding flood zone', advisory:'Minor slowdown due to detour', directions: {} },
        { risk:'Moderate', duration:'1h 05m', distance:'58 km', summary:'Shortest path near watch area', advisory:'Monitor alerts en route', directions: {} }
      ]
    };
  }
};
