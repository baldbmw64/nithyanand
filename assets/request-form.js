/* Nithyanand – Anfrage-Formular für Seiten ohne Menü-Planer (Feste).
   Gleiche Felder & gleiche Mail wie auf der Catering-Seite (NYForm.cateringFields). */
(() => {
  const form = document.getElementById('form'); if (!form) return;
  const EN = document.documentElement.lang === 'en', tr = (de, en) => EN ? en : de;
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const f = form.elements; let step = 0, sending = false;
  const MAP = { hochzeit: 'Hochzeit', geburtstag: 'Geburtstag', firma: 'Firmenfeier', diwali: 'Diwali & Onam', privat: 'Privates Dinner' };

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); $('#datum').min = tomorrow.toISOString().slice(0, 10);
  const setOrt = () => { $('#plzF').style.display = f.ort.value.startsWith('Bei Nith') ? 'none' : ''; };
  const pick = (name, value) => { const r = form.querySelector(`input[name="${name}"][value="${value}"]`); if (r) { r.checked = true; setOrt(); } };
  const qs = new URLSearchParams(location.search);
  if (MAP[qs.get('anlass')]) pick('anlass', MAP[qs.get('anlass')]);
  setOrt();

  /* Links/Buttons auf der Seite, die das Formular mit Vorauswahl öffnen */
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-anlass],[data-ort]'); if (!a) return;
    if (a.dataset.anlass && MAP[a.dataset.anlass]) pick('anlass', MAP[a.dataset.anlass]);
    if (a.dataset.ort === 'restaurant') pick('ort', 'Bei Nithyanand im Restaurant');
  });

  function err(name, msg) { const s = form.querySelector(`[data-err="${name}"]`); if (s) s.textContent = msg || ''; const i = f[name]; if (i && i.classList) i.classList.toggle('err', !!msg); return !msg; }
  function validate(s) {
    let ok = true;
    if (s === 0) {
      ok &= err('anlass', f.anlass.value ? '' : tr('Bitte wählen Sie einen Anlass.', 'Please choose an occasion.'));
      ok &= err('datum', !f.datum.value ? tr('Bitte ein Datum angeben.', 'Please enter a date.') : (f.datum.value < f.datum.min ? tr('Das Datum liegt in der Vergangenheit.', 'This date is in the past.') : ''));
      ok &= err('gaeste', +f.gaeste.value >= 5 ? '' : tr('Mindestens 5 Gäste.', 'Minimum of 5 guests.'));
    }
    if (s === 1 && !f.ort.value.startsWith('Bei Nith')) ok &= err('plz', /\d{5}/.test(f.plz.value) ? '' : tr('Bitte eine Postleitzahl angeben.', 'Please enter a postcode.'));
    if (s === 2) {
      ok &= err('name', f.name.value.trim().length > 1 ? '' : tr('Bitte Ihren Namen angeben.', 'Please enter your name.'));
      ok &= err('email', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value) ? '' : tr('Bitte eine gültige E-Mail-Adresse angeben.', 'Please enter a valid email address.'));
      ok &= err('dsgvo', f.dsgvo.checked ? '' : tr('Bitte stimmen Sie der Verarbeitung zu.', 'Please agree to the processing of your data.'));
    }
    return !!ok;
  }
  function go(s) {
    step = s; $$('#form .stepbox').forEach(b => b.classList.toggle('on', +b.dataset.step === s));
    $$('#prog button').forEach((b, i) => { b.classList.toggle('on', i === s); b.classList.toggle('done', i < s); });
    $('#back').style.visibility = s ? 'visible' : 'hidden';
    $('#next').innerHTML = (s === 2 ? tr('Anfrage senden', 'Send enquiry') : tr('Weiter', 'Next')) + ' <i class="arr"></i>';
    const top = form.getBoundingClientRect().top; if (top < 80) scrollTo({ top: scrollY + top - 110, behavior: 'smooth' });
  }
  async function submit() {
    if (sending) return;
    const svc = $$('#form input[name=service]:checked').map(i => i.value);
    const dt = new Date(f.datum.value + 'T12:00');
    const d = dt.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
    const atRest = f.ort.value.startsWith('Bei Nith');
    const nx = $('#next'), old = nx.innerHTML; sending = true; nx.disabled = true; nx.textContent = tr('Wird gesendet …', 'Sending …');
    try {
      await NYForm.send(`${atRest ? 'Fest-Anfrage (im Restaurant)' : 'Catering-Anfrage'} von ${f.name.value.trim()}: ${f.anlass.value}, ${d}, ${f.gaeste.value} Gäste`,
        NYForm.cateringFields(f, { services: svc, dishes: '', veg: 0 }), f.email.value.trim());
    } catch (e) { sending = false; nx.disabled = false; nx.innerHTML = old; err('dsgvo', NYForm.errorText()); return; }
    sending = false; nx.disabled = false; nx.innerHTML = old;
    const dShow = dt.toLocaleDateString(EN ? 'en-GB' : 'de-DE', { weekday: 'short', day: '2-digit', month: EN ? 'short' : '2-digit', year: 'numeric' });
    const lab = form.querySelector(`input[name=anlass][value="${f.anlass.value}"] + span`).textContent;
    $('#summary').textContent = [
      `${tr('ANLASS  ', 'OCCASION')} ${lab}`,
      `${tr('DATUM   ', 'DATE    ')} ${dShow}${f.zeit.value ? ' · ' + f.zeit.value : ''}`,
      `${tr('GÄSTE   ', 'GUESTS  ')} ${f.gaeste.value}`,
      `${tr('ORT     ', 'VENUE   ')} ${atRest ? 'Nithyanand' : tr('Lieferung', 'Delivery') + (f.plz.value ? ' · ' + f.plz.value : '')}`,
      `${tr('KONTAKT ', 'CONTACT ')} ${f.name.value.trim()}`].join('\n');
    $$('#form .stepbox,#prog,#fnav').forEach(x => { x.style.display = 'none'; }); $('#done').classList.add('show');
    scrollTo({ top: form.getBoundingClientRect().top + scrollY - 110, behavior: 'smooth' });
  }
  $('#next').addEventListener('click', () => { if (!validate(step)) return; if (step < 2) go(step + 1); else submit(); });
  $('#back').addEventListener('click', () => go(step - 1));
  $('#prog').addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (!b) return; const s = +b.dataset.s; if (s <= step || (validate(step) && s === step + 1)) go(s); });
  form.addEventListener('input', e => { if (e.target.classList.contains('err')) err(e.target.name, ''); });
  form.addEventListener('change', e => { if (e.target.name === 'ort') setOrt(); });
})();
