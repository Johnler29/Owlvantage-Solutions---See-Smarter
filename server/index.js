import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Resend } from "resend";
import db from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function buildRegistrationStatusEmail({ approved, registrantName, seminarTitle, seminarDate, seminarTime }) {
  const statusLabel = approved ? "Approved" : "Pending";
  const preheader = approved
    ? "Your registration has been approved."
    : "Your registration is currently pending.";

  const when = [seminarDate, seminarTime].filter(Boolean).join(" • ");

  const subject = approved
    ? `Registration Approved: ${seminarTitle || "Seminar"}`
    : `Registration Status Update: ${seminarTitle || "Seminar"}`;

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5; color: #0f172a;">
      <div style="max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
        <div style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; font-weight: 700;">Owlvantage</div>
        <h1 style="margin: 12px 0 0; font-size: 18px;">Registration ${statusLabel}</h1>
        <p style="margin: 10px 0 0; color: #334155;">Hi ${registrantName || "there"},</p>
        <p style="margin: 10px 0 0; color: #334155;">This is an update for your seminar registration.</p>

        <div style="margin-top: 16px; padding: 14px 16px; border-radius: 12px; background: ${approved ? "#ecfdf5" : "#fffbeb"}; border: 1px solid ${approved ? "#a7f3d0" : "#fde68a"};">
          <div style="font-size: 13px; font-weight: 700; color: ${approved ? "#047857" : "#92400e"};">Status: ${statusLabel}</div>
          <div style="margin-top: 8px; font-size: 13px; color: #0f172a;"><strong>Seminar:</strong> ${seminarTitle || "-"}</div>
          ${when ? `<div style="margin-top: 4px; font-size: 13px; color: #0f172a;"><strong>When:</strong> ${when}</div>` : ""}
        </div>

        <p style="margin: 16px 0 0; color: #334155;">${preheader}</p>
        <p style="margin: 10px 0 0; color: #64748b; font-size: 12px;">If you have questions, just reply to this email.</p>
      </div>
    </div>
  `;

  return { subject, html };
}

async function sendRegistrationStatusEmail({ to, approved, registrantName, seminarTitle, seminarDate, seminarTime }) {
  if (!resend) return { ok: false, skipped: true, reason: "RESEND_API_KEY not configured" };
  if (!to) return { ok: false, skipped: true, reason: "Missing recipient email" };

  const from = process.env.RESEND_FROM || "Owlvantage <onboarding@resend.dev>";
  const { subject, html } = buildRegistrationStatusEmail({
    approved,
    registrantName,
    seminarTitle,
    seminarDate,
    seminarTime,
  });

  const result = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (result?.error) {
    return { ok: false, skipped: false, reason: result.error?.message || "resend_error" };
  }

  return { ok: true, id: result?.data?.id || null };
}

async function startServer() {
  await db.ready;

  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "200kb" }));

  const adminToken = process.env.ADMIN_TOKEN || "mock-admin-token";

  const requireAdmin = (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
    if (!token || token !== adminToken) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }
    return next();
  };

  // --- Events API ---
  app.get("/api/events", (req, res) => {
    db.all("SELECT * FROM events ORDER BY created_at DESC", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  app.post("/api/events", requireAdmin, (req, res) => {
    const { title, description, date, time, location, duration, level, type } = req.body;
    db.run(
      "INSERT INTO events (title, description, date, time, location, duration, level, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [title, description, date, time, location, duration, level, type],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
      }
    );
  });

  app.put("/api/events/:id", requireAdmin, (req, res) => {
    const { title, description, date, time, location, duration, level, type } = req.body;
    db.run(
      "UPDATE events SET title = ?, description = ?, date = ?, time = ?, location = ?, duration = ?, level = ?, type = ? WHERE id = ?",
      [title, description, date, time, location, duration, level, type, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
      }
    );
  });

  app.delete("/api/events/:id", requireAdmin, (req, res) => {
    db.run("DELETE FROM events WHERE id = ?", req.params.id, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ deleted: this.changes });
    });
  });

  // --- Admin Auth (Simple) ---
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    db.get(
      "SELECT * FROM admins WHERE username = ? AND password = ?",
      [username, password],
      (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
          res.json({ success: true, token: adminToken });
        } else {
          res.status(401).json({ success: false, message: "Invalid credentials" });
        }
      }
    );
  });

  app.get("/api/admin/seminar-registration-counts", requireAdmin, (_req, res) => {
    db.all(
      `
      SELECT
        e.id,
        e.title,
        e.date,
        e.time,
        e.type,
        COUNT(r.id) AS registration_count
      FROM events e
      LEFT JOIN registrations r ON r.seminar_id = e.id
      GROUP BY e.id
      ORDER BY e.created_at DESC
      `,
      [],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(rows);
      }
    );
  });

  app.get("/api/admin/registrations", requireAdmin, (req, res) => {
    const seminarIdParam = req.query.seminar_id;
    const seminarId = Number(seminarIdParam);

    if (seminarIdParam && Number.isNaN(seminarId)) {
      return res.status(400).json({ error: "Invalid seminar_id" });
    }

    const hasSeminarFilter = seminarIdParam && !Number.isNaN(seminarId);
    const query = `
      SELECT
        r.id,
        r.name,
        r.email,
        r.phone,
        r.company,
        r.message,
        r.seminar_id,
        r.created_at,
        r.approved_at,
        e.title AS seminar_title,
        e.date AS seminar_date,
        e.time AS seminar_time
      FROM registrations r
      INNER JOIN events e ON e.id = r.seminar_id
      ${hasSeminarFilter ? "WHERE r.seminar_id = ?" : ""}
      ORDER BY r.created_at DESC
    `;

    const params = hasSeminarFilter ? [seminarId] : [];

    db.all(query, params, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.json(rows);
    });
  });

  app.delete("/api/admin/registrations/:id", requireAdmin, (req, res) => {
    db.run("DELETE FROM registrations WHERE id = ?", [req.params.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({ deleted: this.changes });
    });
  });

  app.post("/api/admin/registrations/:id/approval", requireAdmin, (req, res) => {
    const { approved } = req.body ?? {};
    const registrationId = Number(req.params.id);

    if (Number.isNaN(registrationId)) {
      return res.status(400).json({ ok: false, error: "Invalid registration id" });
    }

    const isApproved = Boolean(approved);
    const approvedAt = isApproved ? new Date().toISOString() : null;

    db.run(
      "UPDATE registrations SET approved_at = ? WHERE id = ?",
      [approvedAt, registrationId],
      function (err) {
        if (err) return res.status(500).json({ ok: false, error: err.message });
        if (this.changes === 0) {
          return res.status(404).json({ ok: false, error: "Registration not found" });
        }

        db.get(
          `
          SELECT
            r.email,
            r.name,
            e.title AS seminar_title,
            e.date AS seminar_date,
            e.time AS seminar_time
          FROM registrations r
          INNER JOIN events e ON e.id = r.seminar_id
          WHERE r.id = ?
          `,
          [registrationId],
          async (lookupErr, row) => {
            if (lookupErr) {
              return res.json({ ok: true, approved_at: approvedAt, emailed: false });
            }

            console.log(
              `[admin] registration approval updated id=${registrationId} approved=${isApproved} -> sending email to=${row?.email}`
            );

            try {
              const emailResult = await sendRegistrationStatusEmail({
                to: row?.email,
                approved: isApproved,
                registrantName: row?.name,
                seminarTitle: row?.seminar_title,
                seminarDate: row?.seminar_date,
                seminarTime: row?.seminar_time,
              });

              if (emailResult?.ok) {
                console.log(
                  `[admin] registration email sent ok registrationId=${registrationId} resendId=${emailResult?.id || "-"}`
                );
              } else {
                console.log(
                  `[admin] registration email not sent id=${registrationId} skipped=${Boolean(
                    emailResult?.skipped
                  )} reason=${emailResult?.reason || "unknown"}`
                );
              }

              return res.json({
                ok: true,
                approved_at: approvedAt,
                emailed: Boolean(emailResult?.ok),
                email_skipped: Boolean(emailResult?.skipped),
                email_reason: emailResult?.reason || null,
              });
            } catch (emailErr) {
              console.error("Failed to send registration status email", emailErr);
              return res.json({
                ok: true,
                approved_at: approvedAt,
                emailed: false,
                email_skipped: false,
                email_reason: "send_failed",
              });
            }
          }
        );
      }
    );
  });

  app.get("/api/admin/inquiries", requireAdmin, (_req, res) => {
    db.all(
      `
      SELECT
        id,
        name,
        email,
        phone,
        company,
        message,
        created_at
      FROM inquiries
      ORDER BY created_at DESC
      `,
      [],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(rows);
      }
    );
  });

  app.post("/api/inquiries", (req, res) => {
    const { name, email, phone, company, message } = req.body ?? {};

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "Name, email, and message are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ ok: false, error: "Invalid email format" });
    }

    db.run(
      "INSERT INTO inquiries (name, email, phone, company, message) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone || null, company || null, message],
      function (err) {
        if (err) return res.status(500).json({ ok: false, error: err.message });
        return res.json({ ok: true, id: this.lastID });
      }
    );
  });

  app.post("/api/register-seminar", (req, res) => {
    const { name, email, phone, company, message, seminar_id } = req.body ?? {};

    if (!name || !email || !seminar_id) {
      return res.status(400).json({ ok: false, error: "Name, email, and seminar are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ ok: false, error: "Invalid email format" });
    }

    db.get("SELECT id, title, date, time FROM events WHERE id = ?", [seminar_id], (seminarErr, seminar) => {
      if (seminarErr) {
        return res.status(500).json({ ok: false, error: seminarErr.message });
      }

      if (!seminar) {
        return res.status(404).json({ ok: false, error: "Selected seminar does not exist" });
      }

      db.run(
        "INSERT INTO registrations (name, email, phone, company, message, seminar_id) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, phone || null, company || null, message || null, seminar_id],
        function (insertErr) {
          if (insertErr) {
            if (insertErr.code === "23505" || insertErr.message?.includes("UNIQUE constraint failed")) {
              return res.status(409).json({ ok: false, error: "You are already registered for this seminar" });
            }

            return res.status(500).json({ ok: false, error: insertErr.message });
          }

          return res.json({
            ok: true,
            id: this.lastID,
            seminar: {
              id: seminar.id,
              title: seminar.title,
              date: seminar.date,
              time: seminar.time,
            },
          });
        }
      );
    });
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
