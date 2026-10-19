'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react';

import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { pathFor } from '@/lib/routes';
import { thuTuDichVu } from '@/lib/service-order';
import { SERVICE_KEYS, type ServiceKey } from '@/lib/services';
import type { PhoneEntry } from '@/lib/representatives';

type Status = 'idle' | 'sending' | 'sent' | 'failed' | 'limited';

/**
 * Quotation request form.
 *
 * Validation messages are ours, not the browser's. `checkValidity()` reports
 * in the language of the operating system, so a Vietnamese visitor on an
 * English machine was being shown "Please fill out this field" in the middle
 * of a Vietnamese page. `noValidate` turns the native bubbles off and the
 * messages below come from the dictionary instead, wired to each field with
 * `aria-describedby` so a screen reader reads the error with the input.
 *
 * The endpoint is `/api/quote`, which forwards to BeeOps and falls back to
 * logging when that is not configured.
 *
 * `phone` arrives as a prop rather than being read here: this is a client
 * component, so it cannot await the representative list itself. Contact fetches
 * it once for the whole section and hands down the first entry — the number
 * offered when a submission fails, which has to be one somebody answers.
 */
export function QuoteForm({
  locale,
  dict,
  phone,
}: {
  locale: Locale;
  dict: Dictionary;
  phone: PhoneEntry;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const uid = useId();
  const f = dict.contact.form;

  /**
   * Open the confirmation as a real modal rather than rendering the `open`
   * attribute. Only `showModal()` gives the top layer, the backdrop, the focus
   * trap and Esc-to-close; `<dialog open>` is an inline box with none of it,
   * and rebuilding those by hand is where keyboard and screen-reader users get
   * stranded.
   *
   * Driven from an effect because `showModal()` has to run against the node
   * after React has committed it, and calling it twice on an open dialog
   * throws.
   */
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (status === 'sent' && !el.open) el.showModal();
  }, [status]);

  /**
   * Open on the service the reader came from.
   *
   * Every quote CTA on a service page carries it in the query — see
   * quotePath in lib/routes.ts. Read here off location rather than through
   * useSearchParams, which would opt this statically rendered page into
   * client-side rendering for one preselected option. The select is left
   * uncontrolled and its value set directly, so nothing re-renders and the
   * reader can still change it.
   */
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('service');
    if (!wanted) return;
    if (!(SERVICE_KEYS as readonly string[]).includes(wanted)) return;
    const el = serviceRef.current;
    if (el) el.value = wanted as ServiceKey;
  }, []);

  /**
   * Send focus back to the button that opened the dialog. Without this the
   * browser drops focus to the top of the document, so a keyboard visitor has
   * to tab the whole page again to reach the form they were just using.
   */
  const onDialogClose = useCallback(() => {
    setStatus('idle');
    submitRef.current?.focus();
  }, []);

  /** Lỗi ký tự — chạy cả lúc đang gõ (báo ngay dưới ô) lẫn lúc bấm gửi. */
  function charError(field: 'name' | 'phone', value: string): string | undefined {
    if (field === 'name' && !/^[\p{L}\p{M}\s]*$/u.test(value)) return f.invalidNameChars;
    if (field === 'phone' && /\D/.test(value)) return f.invalidPhoneChars;
    return undefined;
  }

  function onFieldInput(field: 'name' | 'phone', value: string) {
    const msg = charError(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (msg) next[field] = msg;
      else delete next[field];
      return next;
    });
  }

  function validate(data: FormData): Record<string, string> {
    const found: Record<string, string> = {};
    for (const field of ['name', 'phone'] as const) {
      const value = String(data.get(field) ?? '');
      const msg = value.trim() ? charError(field, value) : f.required;
      if (msg) found[field] = msg;
    }
    // Cùng luật với backend (CreateQuoteRequestDto.phone): số VN.
    const phone = String(data.get('phone') ?? '');
    if (!found.phone && phone && !/^(?:84|0)(?:[35789]\d{8}|2\d{9})$/.test(phone)) found.phone = f.invalidPhone;
    const email = String(data.get('email') ?? '').trim();
    // Deliberately loose: the point is to catch a typo, not to police the spec.
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) found.email = f.invalidEmail;
    return found;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Send focus to the first field that needs attention.
      const first = Object.keys(found)[0]!;
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      if (res.status === 429) {
        setStatus('limited');
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('failed');
    }
  }

  const err = (field: string) =>
    errors[field] ? (
      <span className="field__err" id={`${uid}-${field}-err`}>
        {errors[field]}
      </span>
    ) : null;

  const describedBy = (field: string) =>
    errors[field] ? `${uid}-${field}-err` : undefined;

  const sending = status === 'sending';

  return (
    <form className="form" id="quoteForm" ref={formRef} onSubmit={onSubmit} noValidate>
      <div className="form__row">
        <label className={errors.name ? 'is-invalid' : undefined}>
          {f.name}
          <input
            type="text"
            name="name"
            required
            maxLength={20}
            onInput={(e) => onFieldInput('name', e.currentTarget.value)}
            placeholder={f.namePlaceholder}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy('name')}
          />
          {err('name')}
        </label>
        <label className={errors.phone ? 'is-invalid' : undefined}>
          {f.phone}
          <input
            type="tel"
            name="phone"
            required
            inputMode="numeric"
            maxLength={11}
            onInput={(e) => onFieldInput('phone', e.currentTarget.value)}
            placeholder={f.phonePlaceholder}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy('phone')}
          />
          {err('phone')}
        </label>
      </div>

      <label className={errors.email ? 'is-invalid' : undefined}>
        {f.email}
        <input
          type="email"
          name="email"
          placeholder={f.emailPlaceholder}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy('email')}
        />
        {err('email')}
      </label>

      <label>
        {f.service}
        {/* Cùng thứ tự với thẻ trên trang chủ: người vừa xem xong dải thẻ rồi
            mở form ra mà thấy danh sách xếp khác là phải dò lại từ đầu.
            SERVICE_KEYS vẫn dùng cho việc KIỂM giá trị — ở đó thứ tự vô nghĩa. */}
        <select name="service" ref={serviceRef} defaultValue={thuTuDichVu(dict)[0]}>
          {thuTuDichVu(dict).map((key) => (
            <option key={key} value={key}>
              {dict.services.items[key].name}
            </option>
          ))}
        </select>
      </label>

      <label>
        {f.message}
        <textarea name="message" rows={4} placeholder={f.messagePlaceholder} />
      </label>

      {/* Honeypot. Hidden from sight and from the accessibility tree, and out
          of the tab order, so only a script fills it. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hp"
      />

      {/* Consent notice, next to the control that acts on it — this is where a
          visitor decides, so this is where the terms have to be. */}
      <p className="form__consent">
        {f.consent}{' '}
        <Link href={pathFor('privacy', locale)}>{f.consentLink}</Link>.
      </p>

      <button
        className="btn btn--primary btn--block"
        type="submit"
        disabled={sending}
        ref={submitRef}
      >
        {sending ? f.sending : f.submit}
      </button>

      {/* Failure stays here, next to the button, and deliberately does NOT move
          into the dialog: it carries the hotline the visitor needs precisely
          because sending just failed. Behind a dialog that number is one
          dismissal away from being lost, at the moment it matters most.
          Success has no such call to action, so it gets the dialog below. */}
      <p
        className="form__note form__note--failed"
        role="status"
        aria-live="polite"
        hidden={status !== 'failed' && status !== 'limited'}
      >
        {(status === 'failed' || status === 'limited') && (
          <>
            {status === 'limited' ? f.limited : f.failed} <a href={phone.href}>{phone.display}</a>
          </>
        )}
      </p>

      {/* No aria-live here on purpose. A modal dialog is announced when focus
          enters it, so a live region would have the confirmation read twice. */}
      <dialog
        className="modal"
        ref={dialogRef}
        aria-labelledby={`${uid}-sent-title`}
        onClose={onDialogClose}
      >
        <div className="modal__body">
          <p className="modal__mark" aria-hidden="true">
            ✓
          </p>
          <h2 className="modal__title" id={`${uid}-sent-title`}>
            {f.sentTitle}
          </h2>
          <p className="modal__text">{f.sentBody}</p>
          {/* formMethod="dialog" would submit the outer form; this button is
              inside it, so close the dialog explicitly instead. */}
          <button
            className="btn btn--primary"
            type="button"
            onClick={() => dialogRef.current?.close()}
          >
            {f.sentClose}
          </button>
        </div>
      </dialog>
    </form>
  );
}
