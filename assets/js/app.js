// app.js - theme toggle + autocomplete + API helpers

(() => {
  // DARK THEME: toggle + persist
  const body = document.body;
  const saved = localStorage.getItem('dats-theme');
  if (saved === 'dark' || !saved) {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }

  function setTheme(dark) {
    if (dark) {
      body.classList.add('dark-mode');
      localStorage.setItem('dats-theme', 'dark');
    } else {
      body.classList.remove('dark-mode');
      localStorage.setItem('dats-theme', 'light');
    }
    // change button emoji if exists
    const btns = document.querySelectorAll('.theme-toggle');
    btns.forEach(b => b.textContent = dark ? '🌙' : '☀️');
  }

  window.toggleTheme = () => {
    const isDark = body.classList.toggle('dark-mode');
    setTheme(isDark);
  };

  // set initial icon
  document.addEventListener('DOMContentLoaded', () => {
    const btns = document.querySelectorAll('.theme-toggle');
    btns.forEach(b => b.addEventListener('click', toggleTheme));
    btns.forEach(b => b.textContent = body.classList.contains('dark-mode') ? '🌙' : '☀️');
  });

  // --- simple toast helper
  window.appToast = (msg) => {
    if (!msg) return;
    if (window.bootstrap) {
      const toastArea = document.getElementById('app-toast');
      if (toastArea) {
        document.getElementById('app-toast-body').textContent = msg;
        const t = bootstrap.Toast.getOrCreateInstance(toastArea);
        t.show();
        return;
      }
    }
    alert(msg);
  };

  // --- Autocomplete utility
  const CITY_LIST = [
    "Mumbai","Delhi","Bengaluru","Chennai","Kolkata","Hyderabad","Pune","Lucknow","Jaipur","Surat","Nagpur","Patna",
    "Bhopal","Visakhapatnam","Pimpri-Chinchwad","Vadodara","Ghaziabad","Ludhiana","Agra","Nashik","Faridabad","Meerut",
    "Rajkot","Kalyan","Vasai-Virar","Varanasi","Srinagar","Aurangabad","Dhanbad","Amritsar","Navi Mumbai","Allahabad",
    "Ranchi","Howrah","Coimbatore","Jabalpur","Gwalior","Vijayawada","Jodhpur","Madurai","Raipur","Kota","Guwahati",
    "Chandigarh","Thiruvananthapuram","Mysore","Tiruchirappalli","Mangalore","Udaipur","Kochi","Dehradun","Ooty","Munnar",
    "Alappuzha","Kasauli","Matheran","Lonavala","Kodaikanal","Mount Abu","Siliguri","Dibrugarh","Tiruppur","Salem",
    "Agartala","Port Blair","Mount Abu","Nainital","Rishikesh","Shimla","Darjeeling"
  ];

  function attachAutocomplete(inputEl) {
    if (!inputEl) return;
    inputEl.setAttribute('autocomplete','off');
    // wrapper for absolute dropdown
    const wrap = document.createElement('div');
    wrap.style.position = 'relative';
    inputEl.parentNode.insertBefore(wrap, inputEl);
    wrap.appendChild(inputEl);

    const list = document.createElement('div');
    list.className = 'autocomplete-list card';
    list.style.display = 'none';
    list.style.position = 'absolute';
    list.style.left = 0;
    list.style.right = 0;
    list.style.top = inputEl.offsetHeight + 6 + 'px';
    wrap.appendChild(list);

    function showSuggestions(q) {
      list.innerHTML = '';
      if (!q || q.length < 1) { list.style.display = 'none'; return; }
      const ql = q.toLowerCase();
      const matches = CITY_LIST.filter(c => c.toLowerCase().includes(ql)).slice(0,12);
      if (!matches.length) { list.style.display = 'none'; return; }
      matches.forEach(m => {
        const it = document.createElement('div');
        it.className = 'autocomplete-item';
        it.textContent = m;
        it.addEventListener('click', () => {
          inputEl.value = m;
          list.style.display = 'none';
          inputEl.dispatchEvent(new Event('autocomplete-select'));
        });
        list.appendChild(it);
      });
      list.style.display = 'block';
    }

    inputEl.addEventListener('input', (e) => showSuggestions(e.target.value));
    inputEl.addEventListener('focus', (e) => showSuggestions(e.target.value));
    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) list.style.display = 'none';
    });
  }

  // Attach to inputs with class .autocomplete
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input.autocomplete').forEach(attachAutocomplete);
  });

  // --- API helpers (use backend)
  window.apiFetch = {
    async getAlerts(){ try { const r = await fetch('/api/alerts'); return await r.json(); } catch(e){ console.warn(e); return []; } },
    async getRisk(lat, lon){ try { const r = await fetch(`/api/risk?lat=${lat}&lon=${lon}`); return await r.json(); } catch(e){ console.warn(e); return {risk:'Safe', description:'Offline (mock)'}; } },
    async getRoutes(origin, destination){ try { const r = await fetch(`/api/routes?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`); return await r.json(); } catch(e){ console.warn(e); return []; } }
  };

})();
