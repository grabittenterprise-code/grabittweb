import twilio, { Twilio } from "twilio";

import { env, hasTwilioConfig } from "@/lib/env";

let twilioClient: Twilio | null = null;

function getTwilioClient(): Twilio | null {
  if (!hasTwilioConfig || !env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN) {
    return null;
  }

  twilioClient ??= twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  return twilioClient;
}

function normalizePhoneNumber(input: string): string | null {
  const raw = String(input ?? "").trim();
  if (!raw) {
    return null;
  }

  if (raw.startsWith("+")) {
    const digits = raw.slice(1).replace(/\D/g, "");
    return digits.length >= 8 ? `+${digits}` : null;
  }

  if (raw.startsWith("00")) {
    const digits = raw.slice(2).replace(/\D/g, "");
    return digits.length >= 8 ? `+${digits}` : null;
  }

  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    const countryCode = env.TWILIO_DEFAULT_COUNTRY_CODE ?? "+91";
    return `${countryCode}${digits}`;
  }

  if (digits.length >= 11) {
    return `+${digits}`;
  }

  return null;
}

export async function sendSms(to: string, body: string): Promise<boolean> {
  const client = getTwilioClient();
  if (!client) {
    return false;
  }

  const normalizedTo = normalizePhoneNumber(to);
  if (!normalizedTo) {
    return false;
  }

  await client.messages.create({
    to: normalizedTo,
    body,
    ...(env.TWILIO_MESSAGING_SERVICE_SID
      ? { messagingServiceSid: env.TWILIO_MESSAGING_SERVICE_SID }
      : { from: env.TWILIO_FROM_NUMBER }),
  });

  return true;
}

export async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  const client = getTwilioClient();
  if (!client || !env.TWILIO_WHATSAPP_FROM) {
    return false;
  }

  const normalizedTo = normalizePhoneNumber(to);
  if (!normalizedTo) {
    return false;
  }

  await client.messages.create({
    to: `whatsapp:${normalizedTo}`,
    from: env.TWILIO_WHATSAPP_FROM,
    body,
  });

  return true;
}
