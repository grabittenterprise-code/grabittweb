import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { parsePagination, requireAdminOrResponse, toCsv } from "@/app/api/admin/_utils";
import { contactMessagesCollection, getDb } from "@/lib/db";
import { sendAdminReplyEmail } from "@/lib/mailer";
import { sendWhatsAppMessage } from "@/lib/twilio";

export async function GET(request: Request) {
  const auth = await requireAdminOrResponse();
  if ("response" in auth) {
    return auth.response;
  }

  const url = new URL(request.url);
  const { page, pageSize, skip } = parsePagination(url);
  const query = url.searchParams.get("query")?.trim() ?? "";
  const status = url.searchParams.get("status")?.trim() ?? "";
  const exportCsv = url.searchParams.get("export") === "csv";

  const filter: Record<string, unknown> = {};
  if (status) {
    filter.status = status;
  }
  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
      { message: { $regex: query, $options: "i" } },
    ];
  }

  const db = await getDb();
  const total = await contactMessagesCollection(db).countDocuments(filter);
  const items = await contactMessagesCollection(db)
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .toArray();

  if (exportCsv) {
    const csv = toCsv(
      ["id", "name", "email", "message", "status", "date"],
      items.map((message) => [
        message._id?.toString() ?? "",
        message.name,
        message.email,
        message.message,
        message.status,
        message.createdAt.toISOString(),
      ]),
    );
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=contact-messages.csv",
      },
    });
  }

  return NextResponse.json({
    items: items.map((message) => ({
      id: message._id?.toString(),
      name: message.name,
      email: message.email,
      phone: message.phone ?? "",
      message: message.message,
      status: message.status,
      createdAt: message.createdAt,
    })),
    pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
  });
}

export async function PATCH(request: Request) {
  const auth = await requireAdminOrResponse();
  if ("response" in auth) {
    return auth.response;
  }

  const body = await request.json().catch(() => ({}));
  const id = String(body.id ?? "").trim();
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid message id." }, { status: 400 });
  }

  const db = await getDb();
  await contactMessagesCollection(db).updateOne({ _id: new ObjectId(id) }, { $set: { status: "resolved" } });
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const auth = await requireAdminOrResponse();
  if ("response" in auth) {
    return auth.response;
  }

  const body = await request.json().catch(() => ({}));
  const id = String(body.id ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();
  const sendEmail = Boolean(body.sendEmail);
  const sendWhatsApp = Boolean(body.sendWhatsApp);

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid message id." }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: "Reply message is required." }, { status: 400 });
  }

  if (!sendEmail && !sendWhatsApp) {
    return NextResponse.json({ error: "Select at least one channel." }, { status: 400 });
  }

  const db = await getDb();
  const contactMessage = await contactMessagesCollection(db).findOne({ _id: new ObjectId(id) });

  if (!contactMessage) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  const emailSubject = subject || "Reply from GRABITT Support";
  const results = {
    emailSent: false,
    whatsappSent: false,
  };
  const failures: string[] = [];

  if (sendEmail) {
    try {
      results.emailSent = await sendAdminReplyEmail({
        to: contactMessage.email,
        customerName: contactMessage.name,
        subject: emailSubject,
        message,
      });
      if (!results.emailSent) {
        failures.push("Email is not configured or could not be sent.");
      }
    } catch (error) {
      failures.push(error instanceof Error ? `Email failed: ${error.message}` : "Email failed.");
    }
  }

  if (sendWhatsApp) {
    if (!contactMessage.phone) {
      failures.push("This contact does not have a phone number for WhatsApp.");
    } else {
      try {
        results.whatsappSent = await sendWhatsAppMessage(
          contactMessage.phone,
          `Hi ${contactMessage.name},\n\n${message}\n\nGRABITT Support`,
        );
        if (!results.whatsappSent) {
          failures.push("WhatsApp is not configured or could not be sent.");
        }
      } catch (error) {
        failures.push(error instanceof Error ? `WhatsApp failed: ${error.message}` : "WhatsApp failed.");
      }
    }
  }

  if (!results.emailSent && !results.whatsappSent) {
    return NextResponse.json({ error: failures.join(" ") || "Reply could not be sent." }, { status: 400 });
  }

  await contactMessagesCollection(db).updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "resolved" } },
  );

  return NextResponse.json({
    ok: true,
    ...results,
    warning: failures.length ? failures.join(" ") : "",
  });
}

export async function DELETE(request: Request) {
  const auth = await requireAdminOrResponse();
  if ("response" in auth) {
    return auth.response;
  }

  const body = await request.json().catch(() => ({}));
  const id = String(body.id ?? "").trim();
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid message id." }, { status: 400 });
  }

  const db = await getDb();
  await contactMessagesCollection(db).deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
