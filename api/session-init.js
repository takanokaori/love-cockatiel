// api/session-init.js

import jwt from "jsonwebtoken";

export default function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const token = jwt.sign(
      { userId: 123, username: 'dev' },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.setHeader(
      'Set-Cookie',
      `token=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, error: "Invalid credentials" });
  }
}
