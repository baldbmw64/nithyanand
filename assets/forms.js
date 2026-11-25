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

  /* Reservieren-Links: auf externes System (OpenTable) zeigen, sobald hinterlegt */
  document.querySelectorAll('[data-reserve]').forEach(a => {
    if (C.reserveUrl) { a.href = C.reserveUrl; a.target = '_blank'; a.rel = 'noopener'; }
    else if (a.hasAttribute('data-reserve-only')) a.remove();
  });

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
    const tel = C.phoneDisplay || C.phone;
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
