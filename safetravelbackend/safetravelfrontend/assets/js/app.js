// Load Bootstrap Icons via CDN
(function addIcons(){
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css';
  document.head.appendChild(link);
})();

// App utilities
window.app = {
  toast(msg){
    const el = document.getElementById('app-toast');
    if (!el) return;
    document.getElementById('toast-body').textContent = msg;
    const toast = bootstrap.Toast.getOrCreateInstance(el, { delay: 2000 });
    toast.show();
  },
  getLocation(){
    return new Promise((resolve, reject)=>{
      if (!navigator.geolocation) return reject(new Error('No geolocation'));
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 8000 });
    });
  }
};

// Theme toggle
(function themeInit(){
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', ()=>{
    const curr = root.getAttribute('data-theme') || 'light';
    const next = curr === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();
