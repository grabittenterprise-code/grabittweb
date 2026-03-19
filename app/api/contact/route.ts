import { NextResponse } from "next/server";

import { accountActivityCollection, contactMessagesCollection, getDb } from "@/lib/db";
import { sendContactAutoReplyEmail } from "@/lib/mailer";
import { getSessionUser } from "@/lib/server-user";
import { sendSms } from "@/lib/twilio";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  const body = await request.json().catch(() => ({}));

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const db = await getDb();
  const now = new Date();

  await contactMessagesCollection(db).insertOne({
    userId: user?._id ?? null,
    name,
    email,
    phone: phone || undefined,
    message,
    source: "contact_page",
    status: "new",
    createdAt: now,
  });

  if (user?._id) {
    await accountActivityCollection(db).insertOne({
      userId: user._id,
      type: "contact",
      message: "Submitted contact form request",
      createdAt: now,
    });
  }

  let autoReplySent = false;
  let autoReplyError: string | undefined;
  let smsSent = false;
  let smsError: string | undefined;

  try {
    autoReplySent = await sendContactAutoReplyEmail(email, name);
  } catch (error) {
    autoReplySent = false;
    autoReplyError = error instanceof Error ? error.message : "Unknown mail error";
    console.error("Contact auto-reply failed:", error);
  }

  if (phone) {
    try {
      smsSent = await sendSms(
        phone,
        `Hi ${name}, we received your message at GRABITT. Our team will contact you soon.`,
      );
    } catch (error) {
      smsSent = false;
      smsError = error instanceof Error ? error.message : "Unknown SMS error";
      console.error("Contact SMS auto-reply failed:", error);
    }
  }

  return NextResponse.json({
    ok: true,
    autoReplySent,
    smsSent,
    ...(process.env.NODE_ENV !== "production" && !autoReplySent ? { autoReplyError } : {}),
    ...(process.env.NODE_ENV !== "production" && phone && !smsSent ? { smsError } : {}),
  });
}
