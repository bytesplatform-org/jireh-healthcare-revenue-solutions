"use server";

import { SITE } from "@/lib/content";

export type ConsultationResult =
  | { ok: true }
  | {
      ok: false;
      reason: "invalid" | "not-configured" | "failed";
      /** fields that failed validation */
      fields?: string[];
      /** the request as plain text, so the visitor can email it themselves */
      draft?: string;
      /** what was submitted, so the form can refill itself (React resets forms after an action) */
      values?: Record<string, string>;
    };

const text = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL = /^\S+@\S+\.\S+$/;
const phoneOk = (v: string) => /^\+?[\d\s().-]{7,24}$/.test(v) && v.replace(/\D/g, "").length >= 7;

/**
 * Receives a consultation request: the fields from the client's current form
 * (agency name, number of clients, email, phone, best contact time,
 * Medicaid/Medicare) plus an optional note. Validates, then delivers through
 * Resend when it is configured (same approach as Mobile Lab Draws):
 *
 *   RESEND_API_KEY   Resend API key
 *   INQUIRY_TO       where requests go (e.g. support@jirehhealthcarerevenuesolutions.com)
 *   INQUIRY_FROM     a sender on a domain verified with Resend
 *
 * TODO(client): configure the email provider. Until then this returns
 * { ok: false, reason: "not-configured" } with a ready-made email draft, and
 * the form offers that and the phone number instead. It reports ok only when
 * delivery succeeded.
 */
export async function requestConsultation(_prev: ConsultationResult | null, formData: FormData): Promise<ConsultationResult> {
  // honeypot: bots fill every field
  if (text(formData.get("company_site"), 200)) return { ok: true };

  const agency = text(formData.get("agency"), 200);
  const clients = text(formData.get("clients"), 40);
  const email = text(formData.get("email"), 200);
  const phone = text(formData.get("phone"), 40);
  const time = text(formData.get("time"), 120);
  const payer = text(formData.get("payer"), 10);
  const note = text(formData.get("note"), 3000);

  const values = { agency, clients, email, phone, time, payer, note };
  const fields: string[] = [];
  if (!agency) fields.push("agency");
  if (!EMAIL.test(email)) fields.push("email");
  if (!phoneOk(phone)) fields.push("phone");
  if (!time) fields.push("time");
  if (payer !== "Yes" && payer !== "No") fields.push("payer");
  if (fields.length) return { ok: false, reason: "invalid", fields, values };

  const draft = [
    "Free consultation request",
    `Agency: ${agency}`,
    clients && `Number of clients: ${clients}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Best contact time: ${time}`,
    `Medicaid/Medicare: ${payer}`,
    note && `\n${note}`,
  ]
    .filter(Boolean)
    .join("\n");

  const key = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO;
  const from = process.env.INQUIRY_FROM;
  if (!key || !to || !from) return { ok: false, reason: "not-configured", draft, values };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Consultation request: ${agency}`,
        text: `${draft}\n\n— sent from the ${SITE.name} website`,
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return { ok: false, reason: "failed", draft, values };
    return { ok: true };
  } catch {
    return { ok: false, reason: "failed", draft, values };
  }
}
