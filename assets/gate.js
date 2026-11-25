/* ==========================================================
   Vorschau-Passwortschutz (nur für die Abnahmephase!)
   Einfache Sperre im Browser – hält Besucher und Google fern,
   ist aber kein echter Schutz für geheime Daten.
   Zum Livegang: diese Datei + die <script src=".../gate.js">-Zeilen
   und das <meta name="robots" content="noindex"> entfernen.
   Passwort ändern: SHA-256 des neuen Passworts bei HASH eintragen.
   ========================================================== */
(() => {
  const HASH = 'b2ac35b15ddb1ec4413d782a038d61ddef577f98ccb9c2b3788c8adb3125e53c';
  const KEY = 'ny_preview';
  try { if (localStorage.getItem(KEY) === HASH) return; } catch (e) {}
  const root = document.documentElement;
  root.style.visibility = 'hidden';
  const en = root.lang === 'en';
  const sha = async t => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)))].map(b => b.toString(16).padStart(2, '0')).join('');
  const show = () => {
    const d = document.createElement('div');
    d.style.cssText = 'position:fixed;inset:0;z-index:99999;visibility:visible;display:flex;align-items:center;justify-content:center;background:#0d2629;color:#efe2c4;font-family:Jost,system-ui,sans-serif;padding:24px';
    d.innerHTML = '<form style="width:min(360px,100%);text-align:center">'
      + '<div style="font-family:Cormorant Garamond,serif;font-size:34px;margin-bottom:6px">Nithyanand</div>'
      + '<div style="font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#e4b445;margin-bottom:28px">' + (en ? 'Preview · password required' : 'Vorschau · Passwort erforderlich') + '</div>'
      + '<input type="password" autocomplete="current-password" aria-label="' + (en ? 'Password' : 'Passwort') + '" placeholder="' + (en ? 'Password' : 'Passwort') + '" style="width:100%;padding:14px 16px;border:1px solid rgba(228,180,69,.5);background:transparent;color:#efe2c4;font:inherit;font-size:16px;outline:none">'
      + '<button style="width:100%;margin-top:12px;padding:14px;border:0;background:#e4b445;color:#0d2629;font:inherit;font-weight:600;letter-spacing:.14em;text-transform:uppercase;cursor:pointer">' + (en ? 'Enter' : 'Öffnen') + '</button>'
      + '<p data-e style="min-height:20px;margin-top:12px;font-size:13px;color:#f08a6a"></p></form>';
    document.body.appendChild(d);
    const i = d.querySelector('input'); i.focus();
    d.querySelector('form').addEventListener('submit', async e => {
      e.preventDefault();
      if (await sha(i.value) === HASH) { try { localStorage.setItem(KEY, HASH); } catch (x) {} d.remove(); root.style.visibility = ''; }
      else { d.querySelector('[data-e]').textContent = en ? 'Wrong password.' : 'Falsches Passwort.'; i.select(); }
    });
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', show) : show();
})();
