import React from 'react';
import type { ContactBlock } from '../../schema/types.js';
import { cn, isDark } from '../utils.js';

interface Props { block: ContactBlock; }

const LANG_MAP: Record<string, Record<string,string>> = {
  da: { select:'Vælg…', phone:'Telefon', email:'E-mail', hours:'Åbningstider', address:'Adresse', sending:'Sender…', retry:'Prøv igen', submit:'Send besked' },
  de: { select:'Wählen…', phone:'Telefon', email:'E-Mail', hours:'Öffnungszeiten', address:'Adresse', sending:'Senden…', retry:'Erneut', submit:'Nachricht senden' },
  en: { select:'Choose…', phone:'Phone', email:'Email', hours:'Opening hours', address:'Address', sending:'Sending…', retry:'Try again', submit:'Send message' },
};

function detectLang(s: string): string {
  const t = s.toLowerCase();
  if (/\b(send|submit|contact us)\b/.test(t)) return 'en';
  if (/\b(senden|abschicken|anfrage)\b/.test(t)) return 'de';
  return 'da';
}

export function Contact({ block }: Props) {
  const bg   = block.settings?.background ?? 'surface';
  const dark = isDark(bg);
  const { data } = block;
  const { form, contactInfo } = data;
  const lang = detectLang(form.submitLabel ?? '');
  const t = LANG_MAP[lang] ?? LANG_MAP.da;

  const inputCls = cn('form-input', dark ? 'form-input-dark' : '');
  const labelCls = cn('form-label', dark ? 'form-label-dark' : '');

  return (
    <section className={cn('relative py-24 lg:py-32',
      dark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900')} id="contact">
      {dark && <div className="absolute inset-0 dot-grid-dark opacity-40 pointer-events-none" />}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className={cn('grid gap-14 lg:gap-20', contactInfo ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto')}>

          {/* Form side */}
          <div>
            <h2 className={cn('font-extrabold mb-2', dark ? 'text-white' : 'text-gray-900')}
              style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', letterSpacing: '-0.028em' }}>
              {data.heading}
            </h2>
            {data.subtext && (
              <p className={cn('text-base leading-relaxed mb-8', dark ? 'text-white/60' : 'text-gray-500')}>{data.subtext}</p>
            )}

            <form id={form.id} className="space-y-5"
              data-webhook={form.webhook ?? ''}
              onSubmit={`submitForm(event,'${form.id}','${form.successMessage ?? (lang === 'da' ? 'Tak! Vi vender tilbage hurtigst muligt.' : lang === 'de' ? 'Danke! Wir melden uns so bald wie möglich.' : 'Thank you! We\'ll get back to you as soon as possible.')}')` as unknown as React.FormEventHandler}>
              <div className={cn('grid gap-5', form.fields.length > 3 ? 'md:grid-cols-2' : '')}>
                {form.fields.map((field, i) => {
                  const id = `${form.id}_${field.name}`;
                  return (
                    <div key={i} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label htmlFor={id} className={labelCls}>
                        {field.label}{field.required && <span className="text-brand ml-1">*</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea id={id} name={field.name} rows={4} required={field.required}
                          placeholder={field.placeholder ?? ''} className={cn(inputCls,'resize-none')} />
                      ) : field.type === 'select' ? (
                        <select id={id} name={field.name} required={field.required} className={inputCls}>
                          <option value="">{t.select}</option>
                          {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type={field.type} id={id} name={field.name}
                          required={field.required} placeholder={field.placeholder ?? ''} className={inputCls} />
                      )}
                    </div>
                  );
                })}
              </div>

              <button type="submit"
                className="btn btn-primary btn-lg w-full justify-center">
                {form.submitLabel || t.submit}
                <i data-lucide="send" className="w-4 h-4" />
              </button>
              {/* Legacy fallback shown if Notyf didn't load */}
              <p id={`${form.id}_success`} className="hidden text-center text-sm font-medium text-green-600 py-3 bg-green-50 rounded-xl" />
            </form>
          </div>

          {/* Info side */}
          {contactInfo && (
            <div className="lg:pt-12">
              <div className="space-y-5">
                {[
                  { key: 'phone', icon: 'phone', label: t.phone, val: contactInfo.phone, href: `tel:${(contactInfo.phone??'').replace(/\s/g,'')}` },
                  { key: 'email', icon: 'mail', label: t.email, val: contactInfo.email, href: `mailto:${contactInfo.email}` },
                  { key: 'hours', icon: 'clock', label: t.hours, val: contactInfo.hours },
                  { key: 'address', icon: 'map-pin', label: t.address, val: contactInfo.address },
                ].filter(r => r.val).map(r => (
                  <div key={r.key} className="flex items-start gap-4">
                    <div className="icon-box w-11 h-11 shrink-0">
                      <i data-lucide={r.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={cn('text-[10px] font-bold uppercase tracking-[.1em] mb-0.5', dark ? 'text-white/40' : 'text-gray-400')}>
                        {r.label}
                      </div>
                      {r.href ? (
                        <a href={r.href} className={cn('font-semibold text-sm transition-colors', dark ? 'text-white hover:text-brand' : 'text-gray-900 hover:text-brand')}>
                          {r.val}
                        </a>
                      ) : (
                        <span className={cn('font-semibold text-sm', dark ? 'text-white' : 'text-gray-900')}>{r.val}</span>
                      )}
                    </div>
                  </div>
                ))}
                {contactInfo.mapEmbed && (
                  <div className="mt-6 rounded-2xl overflow-hidden" style={{ height: '220px' }}>
                    <iframe src={contactInfo.mapEmbed} width="100%" height="100%" loading="lazy"
                      style={{ border: 0 }} allowFullScreen referrerPolicy="no-referrer-when-downgrade" title="Kort" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
async function submitForm(e, id, successMsg) {
  e.preventDefault();
  const form = document.getElementById(id);
  const btn = form.querySelector('button[type=submit]');
  const sEl = document.getElementById(id + '_success');
  const data = Object.fromEntries(new FormData(form));
  btn.disabled = true;
  const origHtml = btn.innerHTML;
  btn.innerHTML = '<svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="60" stroke-dashoffset="60" style="animation:spin 1s linear infinite"/></svg> ${t.sending}';
  try {
    const wh = form.dataset.webhook;
    if (wh) await fetch(wh, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    form.reset();
    btn.innerHTML = origHtml; btn.disabled = false;
    if (window._notyf) {
      window._notyf.success(successMsg);
    } else {
      sEl.textContent = successMsg; sEl.classList.remove('hidden');
      setTimeout(function(){ sEl.classList.add('hidden'); }, 6000);
    }
  } catch(err) {
    btn.innerHTML = origHtml; btn.disabled = false;
    if (window._notyf) {
      window._notyf.error('${t.retry}');
    } else {
      btn.textContent = '${t.retry}';
    }
  }
}
      `.trim() }} />
    </section>
  );
}
