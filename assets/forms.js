/* Nithyanand – Formularversand über Web3Forms (funktioniert auf jeder statischen Seite, z. B. GitHub Pages) */
(() => {
  const C = window.NY_CONFIG || {};
  const en = document.documentElement.lang === 'en';

  /* Anrufen-Links aus der Konfiguration befüllen */
  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    if (C.phone) a.href = 'tel:' + C.phone.replace(/[^\d+]/g, '');
  });

  /* Telefonnummer in Kontaktblöcke schreiben, ohne Nummer Zeile ausblenden */
  document.querySelectorAll('[data-phone]').forEach(a => { if (C.phone) a.textContent = C.phoneDisplay || C.phone; });
  document.querySelectorAll('[data-phone-row]').forEach(r => { if (!C.phone) r.style.display = 'none'; });

  /* Reservieren-Links: auf externes System (OpenTable) zeigen, sobald hinterlegt –
     bis dahin öffnet sich ein Pop-up mit Platzhalter für die OpenTable-Einbindung */
  if (C.reserveUrl) {
    document.querySelectorAll('[data-reserve]').forEach(a => { a.href = C.reserveUrl; a.target = '_blank'; a.rel = 'noopener'; });
  } else {
    const css = `
    .otm{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(5,14,15,.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
    .otm.open{display:flex}
    .otm-box{position:relative;width:min(520px,100%);max-height:92vh;overflow:auto;background:#f4e9d0;color:#231811;padding:44px 34px 34px;text-align:center;box-shadow:0 40px 100px rgba(0,0,0,.5);font-family:Jost,system-ui,sans-serif}
    .otm-k{font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:#a3261c}
    .otm-box h2{font-family:"Cormorant Garamond",serif;font-weight:600;font-size:40px;line-height:1;margin:10px 0 26px}
    .otm-logo{display:inline-flex;align-items:center;gap:10px;font-family:Jost,system-ui,sans-serif;font-weight:600;font-size:30px;letter-spacing:-.01em;color:#231811}
    .otm-logo svg{width:34px;height:34px}
    .otm-frame{margin:22px 0 0;border:2px dashed rgba(35,24,17,.35);background:rgba(255,255,255,.45);padding:34px 20px;min-height:180px;display:flex;flex-direction:column;justify-content:center;gap:10px}
    .otm-frame b{font-size:17px;line-height:1.4}
    .otm-frame code{font-family:ui-monospace,Menlo,monospace;font-size:13px;letter-spacing:.04em;color:#a3261c}
    .otm-frame small{font-size:13px;line-height:1.5;color:#5a4634}
    .otm-x{position:absolute;right:14px;top:12px;width:38px;height:38px;font-size:20px;line-height:38px;color:#231811;background:none;border:0;cursor:pointer}`;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const m = document.createElement('div');
    m.className = 'otm'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', en ? 'Book a table' : 'Tisch reservieren');
    m.innerHTML = `<div class="otm-box">
      <button type="button" class="otm-x" aria-label="${en ? 'Close' : 'Schließen'}">✕</button>
      <div class="otm-k">${en ? 'Reservation' : 'Reservierung'}</div>
      <h2>${en ? 'Book a table' : 'Tisch reservieren'}</h2>
      <div class="otm-logo" aria-label="OpenTable"><svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="13" fill="none" stroke="#da3743" stroke-width="7"/><circle cx="17" cy="17" r="3.2" fill="#da3743"/></svg>OpenTable</div>
      <div class="otm-frame">
        <b>${en ? 'The OpenTable booking will be shown here.' : 'Hier wird die Reservierung über OpenTable angezeigt.'}</b>
        <code>iframe / ${en ? 'interface' : 'Schnittstelle'} / ${en ? 'link' : 'Verlinkung'}</code>
        <small>${en ? 'Placeholder – activated as soon as the restaurant’s OpenTable account is set up.' : 'Platzhalter – wird aktiviert, sobald das OpenTable-Konto des Restaurants eingerichtet ist.'}</small>
      </div>
    </div>`;
    const mount = () => document.body.appendChild(m);
    document.body ? mount() : document.addEventListener('DOMContentLoaded', mount);
    let last;
    const open = () => { last = document.activeElement; m.classList.add('open'); document.documentElement.style.overflow = 'hidden'; const nav = document.querySelector('.nav.open'); if (nav) nav.classList.remove('open'); setTimeout(() => m.querySelector('.otm-x').focus(), 30); };
    const close = () => { m.classList.remove('open'); document.documentElement.style.overflow = ''; if (last) last.focus(); };
    document.addEventListener('click', e => {
      const a = e.target.closest('[data-reserve]'); if (a) { e.preventDefault(); open(); return; }
      if (e.target === m || e.target.closest('.otm-x')) close();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('open')) close(); });
  }

  async function send(subject, fields, replyTo) {
    if (!C.formKey) throw new Error('nokey');
    const body = { access_key: C.formKey, subject, from_name: 'Website Nithyanand', ...fields };
    if (replyTo) body.replyto = replyTo;
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.success) throw new Error(j.message || 'send');
    return j;
  }

  /* Fehlermeldung mit Ausweichweg (Telefon) */
  function errorText() {
    return en
      ? `Sorry, your request could not be sent. Please try again${tel ? ` or call us on ${tel}` : ''}.`
      : `Leider konnte Ihre Anfrage nicht gesendet werden. Bitte versuchen Sie es noch einmal${tel ? ` oder rufen Sie uns an: ${tel}` : ''}.`;
  }

  /* Catering-Anfrage als übersichtliche Einzelfelder (immer auf Deutsch, Reihenfolge = Reihenfolge in der Mail) */
  function cateringFields(f, opt) {
    const v = x => (x && String(x).trim()) || '–';
    const dt = f.datum.value ? new Date(f.datum.value + 'T12:00') : null;
    const atRest = f.ort.value.startsWith('Bei Nith');
    return {
      'Anlass': v(f.anlass.value),
      'Datum': dt ? dt.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '–',
      'Uhrzeit': f.zeit.value ? f.zeit.value + ' Uhr' : '–',
      'Anzahl Gäste': v(f.gaeste.value),
      'Format': f.format.value && f.format.value !== 'Beratung' ? f.format.value : 'Noch offen – Beratung gewünscht',
      'Ort': atRest ? 'Im Restaurant Nithyanand' : 'Lieferung zum Kunden',
      'Lieferort (PLZ / Ort)': atRest ? '–' : v(f.plz.value),
      'Zusatzleistungen': opt.services.length ? opt.services.join(', ') : '–',
      'Gerichte aus dem Menü-Planer': opt.dishes || '–',
      'Anteil vegetarisch (Planer)': opt.dishes ? opt.veg + ' %' : '–',
      'Allergien & Wünsche': v(f.wuensche.value),
      'Name': v(f.name.value),
      'Telefon': v(f.tel.value),
      'email': v(f.email.value),
      'Sprache der Website': document.documentElement.lang === 'en' ? 'Englisch' : 'Deutsch',
    };
  }

  window.NYForm = { send, errorText, cateringFields };
})();
