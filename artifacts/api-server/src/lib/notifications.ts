import nodemailer, { type Transporter } from "nodemailer";

let cachedTransport: Transporter | null = null;
let twilioClient: { messages: { create: (opts: { body: string; from: string; to: string }) => Promise<unknown> } } | null = null;
let twilioInitTried = false;

function getMailTransport(): Transporter | null {
  if (cachedTransport) return cachedTransport;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT ?? 587);
  cachedTransport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cachedTransport;
}

async function getTwilioClient() {
  if (twilioClient || twilioInitTried) return twilioClient;
  twilioInitTried = true;
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const auth = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !auth) return null;
  try {
    const mod = (await import("twilio")) as unknown as {
      default: (sid: string, auth: string) => typeof twilioClient;
    };
    twilioClient = mod.default(sid, auth);
    return twilioClient;
  } catch (err) {
    console.warn("[notifications] twilio init failed:", err);
    return null;
  }
}

function brandSiteName(): string {
  return process.env.SITE_NAME ?? "TelePhysio";
}

function fromEmail(): string {
  return process.env.SMTP_FROM ?? `${brandSiteName()} <no-reply@telephysio.local>`;
}

function fromPhone(): string | null {
  return process.env.TWILIO_FROM_NUMBER ?? null;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<void> {
  const transport = getMailTransport();
  if (!transport) {
    console.info(
      `[notifications] email skipped (SMTP not configured) → to=${opts.to} subject=${JSON.stringify(opts.subject)}`,
    );
    return;
  }
  try {
    await transport.sendMail({
      from: fromEmail(),
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
    console.info(`[notifications] email sent → ${opts.to}`);
  } catch (err) {
    console.error(`[notifications] email failed for ${opts.to}:`, err);
  }
}

export async function sendSms(opts: { to: string; body: string }): Promise<void> {
  const client = await getTwilioClient();
  const from = fromPhone();
  if (!client || !from) {
    console.info(
      `[notifications] sms skipped (Twilio not configured) → to=${opts.to} body=${JSON.stringify(opts.body)}`,
    );
    return;
  }
  try {
    await client.messages.create({ body: opts.body, from, to: opts.to });
    console.info(`[notifications] sms sent → ${opts.to}`);
  } catch (err) {
    console.error(`[notifications] sms failed for ${opts.to}:`, err);
  }
}

export interface AppointmentNotice {
  patientName: string;
  serviceType: string;
  sessionMode: string | null;
  sessionDate: string | null;
  sessionTime: string | null;
  sessionLink: string | null;
  physiotherapist: string | null;
  rejectionReason: string | null;
  notes: string | null;
}

function modeLabel(mode: string | null): string {
  if (mode === "in-person") return "In-Person";
  if (mode === "online") return "Online";
  return "";
}

export async function notifyAppointmentApproved(
  patient: { name: string; email: string; phone: string },
  appt: AppointmentNotice,
): Promise<void> {
  const site = brandSiteName();
  const when = [appt.sessionDate, appt.sessionTime].filter(Boolean).join(" at ");
  const mode = modeLabel(appt.sessionMode);
  const lines = [
    `Dear ${patient.name},`,
    "",
    `Good news — your appointment request has been approved by our care team.`,
    "",
    `Service: ${appt.serviceType}${mode ? ` (${mode})` : ""}`,
    when ? `Scheduled: ${when}` : null,
    appt.physiotherapist ? `Physiotherapist: ${appt.physiotherapist}` : null,
    appt.sessionLink ? `Video session link: ${appt.sessionLink}` : null,
    appt.notes ? `\nNotes from our team:\n${appt.notes}` : null,
    "",
    `You can view full details in your patient dashboard.`,
    "",
    `— ${site} Care Team`,
  ].filter(Boolean) as string[];

  const text = lines.join("\n");
  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f2a33">
      <h2 style="color:#1c6e7a;margin:0 0 16px">Appointment confirmed</h2>
      <p>Dear ${patient.name},</p>
      <p>Good news — your appointment request has been <strong>approved</strong> by our care team.</p>
      <table style="border-collapse:collapse;margin:16px 0;font-size:14px">
        <tr><td style="padding:6px 12px;color:#5a7783">Service</td><td style="padding:6px 12px"><strong>${appt.serviceType}${mode ? ` (${mode})` : ""}</strong></td></tr>
        ${when ? `<tr><td style="padding:6px 12px;color:#5a7783">When</td><td style="padding:6px 12px"><strong>${when}</strong></td></tr>` : ""}
        ${appt.physiotherapist ? `<tr><td style="padding:6px 12px;color:#5a7783">Physiotherapist</td><td style="padding:6px 12px">${appt.physiotherapist}</td></tr>` : ""}
        ${appt.sessionLink ? `<tr><td style="padding:6px 12px;color:#5a7783">Session link</td><td style="padding:6px 12px"><a href="${appt.sessionLink}">${appt.sessionLink}</a></td></tr>` : ""}
      </table>
      ${appt.notes ? `<p style="background:#f3f7f8;padding:12px 14px;border-radius:8px;font-size:13px"><strong>Note from our team:</strong><br>${appt.notes}</p>` : ""}
      <p style="margin-top:20px;font-size:13px;color:#5a7783">— ${site} Care Team</p>
    </div>
  `;

  const sms = [
    `[${site}] Appointment confirmed: ${appt.serviceType}${mode ? ` (${mode})` : ""}.`,
    when ? `When: ${when}.` : null,
    appt.sessionLink ? `Join: ${appt.sessionLink}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  await Promise.all([
    patient.email
      ? sendEmail({ to: patient.email, subject: `${site}: appointment confirmed`, text, html })
      : Promise.resolve(),
    patient.phone ? sendSms({ to: patient.phone, body: sms }) : Promise.resolve(),
  ]);
}

export async function notifyAppointmentRejected(
  patient: { name: string; email: string; phone: string },
  appt: AppointmentNotice,
): Promise<void> {
  const site = brandSiteName();
  const reason = appt.rejectionReason?.trim();
  const text = [
    `Dear ${patient.name},`,
    "",
    `We're sorry — we couldn't accommodate your recent appointment request for ${appt.serviceType}.`,
    reason ? `Reason: ${reason}` : null,
    "",
    `Please log in to your dashboard to submit a new request, or reply to this email so we can help you find a suitable slot.`,
    "",
    `— ${site} Care Team`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f2a33">
      <h2 style="color:#9a3a3a;margin:0 0 16px">Appointment request update</h2>
      <p>Dear ${patient.name},</p>
      <p>We're sorry — we couldn't accommodate your recent request for <strong>${appt.serviceType}</strong>.</p>
      ${reason ? `<p style="background:#fdf3f3;padding:12px 14px;border-radius:8px;font-size:13px"><strong>Reason:</strong><br>${reason}</p>` : ""}
      <p>Please log in to your dashboard to submit a new request, or reply to this email so we can help you find a suitable slot.</p>
      <p style="margin-top:20px;font-size:13px;color:#5a7783">— ${site} Care Team</p>
    </div>
  `;

  const sms = `[${site}] Your appointment request for ${appt.serviceType} could not be confirmed.${reason ? ` Reason: ${reason}.` : ""} Please log in to request another slot.`;

  await Promise.all([
    patient.email
      ? sendEmail({ to: patient.email, subject: `${site}: appointment request update`, text, html })
      : Promise.resolve(),
    patient.phone ? sendSms({ to: patient.phone, body: sms }) : Promise.resolve(),
  ]);
}
