import type { ContactBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';

type Lang = 'da' | 'de' | 'en';

function detectLang(text: string): Lang {
  const t = text.toLowerCase();
  if (/\b(send|submit|get quote|contact us)\b/.test(t)) return 'en';
  if (/\b(senden|abschicken|anfrage|jetzt|kostenlos)\b/.test(t)) return 'de';
  return 'da';
}

const I18N: Record<Lang, { select: string; phone: string; email: string; hours: string; address: string; sending: string; retry: string }> = {
  da: { select: 'Vælg…',   phone: 'Telefon',  email: 'E-mail', hours: 'Åbningstider', address: 'Adresse', sending: 'Sender…',    retry: 'Prøv igen' },
  de: { select: 'Wählen…', phone: 'Telefon',  email: 'E-Mail', hours: 'Öffnungszeiten', address: 'Adresse', sending: 'Senden…',  retry: 'Erneut versuchen' },
  en: { select: 'Choose…', phone: 'Phone',    email: 'Email',  hours: 'Opening hours',  address: 'Address', sending: 'Sending…', retry: 'Try again' },
};

export function renderContact(block: ContactBlock): string {
  const bg = block.settings?.background ?? 'white';
  const dark = isDark(bg);
  const sec = sectionClasses(bg, block.settings?.paddingY);
  const { data } = block;
  const { form, contactInfo } = data;
  const lang = detectLang(form.submitLabel ?? '');
  const t = I18N[lang];

  const inputClass = `w-full px-4 py-3 rounded-lg border ${dark ? 'border-white/20 bg-white/10 text-white placeholder-white/40' : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400'} text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 transition-colors`;

  const fieldsHtml = form.fields.map(field => {
    const label = `<label for="${esc(form.id)}_${esc(field.name)}" class="block text-sm font-medium mb-1.5">
      ${esc(field.label)}${field.required ? ' <span class="text-brand">*</span>' : ''}
    </label>`;

    let input: string;
    if (field.type === 'textarea') {
      input = `<textarea id="${esc(form.id)}_${esc(field.name)}" name="${esc(field.name)}" rows="4" ${field.required ? 'required' : ''} placeholder="${esc(field.placeholder ?? '')}" class="${inputClass} resize-none"></textarea>`;
    } else if (field.type === 'select') {
      const options = field.options?.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('') ?? '';
      input = `<select id="${esc(form.id)}_${esc(field.name)}" name="${esc(field.name)}" ${field.required ? 'required' : ''} class="${inputClass}">
        <option value="">${t.select}</option>
        ${options}
      </select>`;
    } else {
      input = `<input type="${esc(field.type)}" id="${esc(form.id)}_${esc(field.name)}" name="${esc(field.name)}" ${field.required ? 'required' : ''} placeholder="${esc(field.placeholder ?? '')}" class="${inputClass}">`;
    }

    return `<div>${label}${input}</div>`;
  }).join('');

  const formHtml = `
    <form
      id="${esc(form.id)}"
      class="space-y-5"
      onsubmit="submitForm(event, '${esc(form.id)}', '${esc(form.successMessage ?? 'Tak! Vi vender tilbage hurtigst muligt.')}')"
    >
      ${fieldsHtml}
      <button type="submit" class="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3.5 px-6 rounded-lg transition-colors text-sm">
        ${esc(form.submitLabel)}
      </button>
      <p id="${esc(form.id)}_success" class="hidden text-center text-sm font-medium text-green-600 py-2 bg-green-50 rounded-lg"></p>
    </form>`;

  const infoHtml = contactInfo
    ? `<div class="space-y-5">
        ${contactInfo.phone ? `<div class="flex items-start gap-4">
          <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-brand/10 text-brand"><i data-lucide="phone" class="w-5 h-5"></i></div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wide ${dark ? 'text-gray-400' : 'text-gray-400'} mb-0.5">${t.phone}</div>
            <a href="tel:${esc(contactInfo.phone.replace(/\s/g, ''))}" class="font-semibold hover:text-brand transition-colors">${esc(contactInfo.phone)}</a>
          </div>
        </div>` : ''}
        ${contactInfo.email ? `<div class="flex items-start gap-4">
          <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-brand/10 text-brand"><i data-lucide="mail" class="w-5 h-5"></i></div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wide ${dark ? 'text-gray-400' : 'text-gray-400'} mb-0.5">${t.email}</div>
            <a href="mailto:${esc(contactInfo.email)}" class="font-semibold hover:text-brand transition-colors">${esc(contactInfo.email)}</a>
          </div>
        </div>` : ''}
        ${contactInfo.hours ? `<div class="flex items-start gap-4">
          <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-brand/10 text-brand"><i data-lucide="clock" class="w-5 h-5"></i></div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wide ${dark ? 'text-gray-400' : 'text-gray-400'} mb-0.5">${t.hours}</div>
            <span class="font-semibold">${esc(contactInfo.hours)}</span>
          </div>
        </div>` : ''}
        ${contactInfo.address ? `<div class="flex items-start gap-4">
          <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-brand/10 text-brand"><i data-lucide="map-pin" class="w-5 h-5"></i></div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wide ${dark ? 'text-gray-400' : 'text-gray-400'} mb-0.5">${t.address}</div>
            <span class="font-semibold">${esc(contactInfo.address)}</span>
          </div>
        </div>` : ''}
        ${contactInfo.mapEmbed ? `<div class="mt-4 rounded-xl overflow-hidden" style="height:200px">
          <iframe src="${esc(contactInfo.mapEmbed)}" width="100%" height="100%" style="border:0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Kort"></iframe>
        </div>` : ''}
      </div>`
    : '';

  const submitScript = `
<script>
async function submitForm(e, id, successMsg) {
  e.preventDefault();
  const form = document.getElementById(id);
  const btn = form.querySelector('button[type=submit]');
  const successEl = document.getElementById(id + '_success');
  const data = Object.fromEntries(new FormData(form));
  btn.disabled = true;
  btn.textContent = '${t.sending}';
  try {
    const webhook = form.dataset.webhook;
    if (webhook) await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    form.reset();
    successEl.textContent = successMsg;
    successEl.classList.remove('hidden');
    btn.classList.add('hidden');
  } catch {
    btn.disabled = false;
    btn.textContent = '${t.retry}';
  }
}
</script>`.trim();

  return `
<section class="${sec}" id="contact">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="grid ${contactInfo ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto'} gap-14 lg:gap-20">

      <div>
        <h2 class="text-3xl md:text-4xl font-extrabold font-heading mb-2">${esc(data.heading)}</h2>
        ${data.subtext ? `<p class="text-base ${dark ? 'text-gray-300' : 'text-gray-500'} mb-8">${esc(data.subtext)}</p>` : ''}
        ${formHtml}
      </div>

      ${contactInfo ? `<div class="lg:pt-16">${infoHtml}</div>` : ''}

    </div>
  </div>
  ${submitScript}
</section>`.trim();
}
