// api/login.js
// JWT発行

import jwt from "jsonwebtoken";

export default function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { username, password } = req.body;
    // ここは本来DBでユーザー認証する
    if (username === 'dev' && password === 'password') {
      // セッション方式
      /*
      req.session.regenerate(err => {
        if (err) {
          // error handling
        }
        req.session.user = { id: 123, username: "dev" };
        res.json({ success: true });
      });
      */
      // JWTを発行する場合
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
    } else {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
