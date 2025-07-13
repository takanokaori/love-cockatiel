import express from "express";
import session from "express-session";
import dotenv from "dotenv";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";
import cors from "cors";
import { verifyJwtFromCookies } from "./lib/auth.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',  // フロント側URL
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "dev-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1時間
  },
  // genid: () => crypto.randomBytes(32).toString("hex"),
}));

// ログイン
/*
app.post('/app/login', (req, res) => {
  const { username, password } = req.body;
  // ここは本来DBでユーザー認証する
  if (username === 'dev' && password === 'password') {
    // セッション方式
    req.session.regenerate(err => {
      if (err) {
        // error handling
      }
      req.session.user = { id: 123, username: "dev" };
      res.json({ success: true });
    });
    // JWTを発行する場合
    const token = jwt.sign(
      { userId: 123, username: 'dev' },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const isProduction = process.env.NODE_ENV === "production";
    res.setHeader(
      'Set-Cookie',
      `token=${encodeURIComponent(token)}; HttpOnly; ${isProduction ? 'Secure;' : ''} Path=/; Max-Age=3600; SameSite=Strict`,
    );
    // cookie-parserをインストールして使用する場合
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // 本番は true
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, error: "Invalid credentials" });
  }
});
*/

// ログアウト
/*
app.post("/app/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    return res.json({ success: true });
  });
});
*/

app.post('/app/session-init', (req, res) => {
  req.session.regenerate(err => {
    if (err) {
      console.error(err);
    }
    req.session.allowed = true;
    res.json({ success: true });
  });
});

app.get('/app/instagram', async (req, res) => {
  // Cookie認証
  /*
  const decoded = verifyJwtFromCookies(req);
  if (!decoded) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  */

  if (!req.session.allowed) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Instagram Graph APIを呼ぶ
    const instagramToken = process.env.INSTAGRAM_TOKEN;
    const url = `https://graph.facebook.com/v23.0/17841475622221032?fields=media%7Bmedia_url%2Ccaption%2Cpermalink%2Ctimestamp%7D&access_token=${instagramToken}`;

    const response = await fetch(url);
    if (!response.ok){
      const errorText = await response.text();
      console.error("Fetch failed:", errorText);
      return res.status(500).json({ error: "Instagram API error (!response)", details: errorText });
    }

    const data = await response.json();
    console.log("Instagram API response", JSON.stringify(data, null, 2));

    // 最新3件だけ返す
    const latestThree = data.media?.data?.slice(0, 3) || [];
    console.log("latestThree", latestThree);
    return res.json(latestThree);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Instagram API error ( Instagram Graph API )" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});
