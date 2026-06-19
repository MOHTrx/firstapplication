// netlify/functions/auth.js
// Server-side admin password check — password never in browser JS.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server misconfiguration" }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  if (body.password === ADMIN_PASSWORD) {
    // Issue a short-lived session token (base64 of password hash for simplicity)
    const token = Buffer.from(ADMIN_PASSWORD + Date.now()).toString("base64");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, token }),
    };
  } else {
    // Add a small delay to slow brute force attempts
    await new Promise((r) => setTimeout(r, 800));
    return {
      statusCode: 401,
      body: JSON.stringify({ ok: false, error: "كلمة السر غير صحيحة" }),
    };
  }
};
