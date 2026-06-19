// netlify/functions/submit.js
// Runs SERVER-SIDE on Netlify — secrets never reach the browser.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const TG_TOKEN  = process.env.TG_TOKEN;
  const TG_CHATID = process.env.TG_CHATID;

  if (!TG_TOKEN || !TG_CHATID) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server misconfiguration" }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { name, phone, age, gov, edu, exp } = body;

  if (!name || !phone || !age || !gov) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
  }

  if (!/^01[0-2]\d{8}$/.test(phone)) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid phone number" }) };
  }

  const safe = (s) => String(s || "").replace(/[<>&"]/g, "").slice(0, 200);

  const text =
    `📋 *تقديم جديد — شركة مكة*\n` +
    `━━━━━━━━━━━━━━\n` +
    `👤 الاسم: ${safe(name)}\n` +
    `📞 الموبايل: ${safe(phone)}\n` +
    `🎂 السن: ${safe(age)}\n` +
    `📍 المحافظة: ${safe(gov)}\n` +
    `🎓 المؤهل: ${safe(edu) || "—"}\n` +
    `💼 الخبرة: ${safe(exp) || "—"}\n` +
    `🕐 الوقت: ${new Date().toLocaleString("ar-EG", { timeZone: "Africa/Cairo" })}`;

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TG_CHATID, text, parse_mode: "Markdown" }),
      }
    );

    const tgJson = await tgRes.json();

    if (!tgJson.ok) {
      console.error("Telegram error:", tgJson);
      return { statusCode: 502, body: JSON.stringify({ error: "Telegram delivery failed" }) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error("Network error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Network error" }) };
  }
};
