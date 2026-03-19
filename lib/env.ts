type RequiredEnvKey = "MONGODB_URI" | "MONGODB_DB" | "NEXTAUTH_SECRET";
type OptionalEnvKey =
  | "NEXTAUTH_URL"
  | "GOOGLE_CLIENT_ID"
  | "GOOGLE_CLIENT_SECRET"
  | "SMTP_HOST"
  | "SMTP_PORT"
  | "SMTP_USER"
  | "SMTP_PASS"
  | "SMTP_FROM"
  | "TWILIO_ACCOUNT_SID"
  | "TWILIO_AUTH_TOKEN"
  | "TWILIO_FROM_NUMBER"
  | "TWILIO_MESSAGING_SERVICE_SID"
  | "TWILIO_WHATSAPP_FROM"
  | "TWILIO_DEFAULT_COUNTRY_CODE"
  | "ADMIN_SUPER_EMAIL"
  | "ADMIN_EMAIL_ALLOWLIST";

function readRequiredEnv(key: RequiredEnvKey): string {
  const value = process.env[key];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value.trim();
}

function readOptionalEnv(key: OptionalEnvKey): string | undefined {
  const value = process.env[key];
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export const env = {
  MONGODB_URI: readRequiredEnv("MONGODB_URI"),
  MONGODB_DB: readRequiredEnv("MONGODB_DB"),
  NEXTAUTH_SECRET: readRequiredEnv("NEXTAUTH_SECRET"),
  NEXTAUTH_URL: readOptionalEnv("NEXTAUTH_URL"),
  GOOGLE_CLIENT_ID: readOptionalEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: readOptionalEnv("GOOGLE_CLIENT_SECRET"),
  SMTP_HOST: readOptionalEnv("SMTP_HOST"),
  SMTP_PORT: readOptionalEnv("SMTP_PORT"),
  SMTP_USER: readOptionalEnv("SMTP_USER"),
  SMTP_PASS: readOptionalEnv("SMTP_PASS"),
  SMTP_FROM: readOptionalEnv("SMTP_FROM"),
  TWILIO_ACCOUNT_SID: readOptionalEnv("TWILIO_ACCOUNT_SID"),
  TWILIO_AUTH_TOKEN: readOptionalEnv("TWILIO_AUTH_TOKEN"),
  TWILIO_FROM_NUMBER: readOptionalEnv("TWILIO_FROM_NUMBER"),
  TWILIO_MESSAGING_SERVICE_SID: readOptionalEnv("TWILIO_MESSAGING_SERVICE_SID"),
  TWILIO_WHATSAPP_FROM: readOptionalEnv("TWILIO_WHATSAPP_FROM"),
  TWILIO_DEFAULT_COUNTRY_CODE: readOptionalEnv("TWILIO_DEFAULT_COUNTRY_CODE"),
  ADMIN_SUPER_EMAIL: readOptionalEnv("ADMIN_SUPER_EMAIL"),
  ADMIN_EMAIL_ALLOWLIST: readOptionalEnv("ADMIN_EMAIL_ALLOWLIST"),
};

export const hasGoogleOAuth = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
export const hasSmtpConfig = Boolean(
  env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS && env.SMTP_FROM,
);
export const hasTwilioConfig = Boolean(
  env.TWILIO_ACCOUNT_SID &&
    env.TWILIO_AUTH_TOKEN &&
    (env.TWILIO_FROM_NUMBER || env.TWILIO_MESSAGING_SERVICE_SID),
);
