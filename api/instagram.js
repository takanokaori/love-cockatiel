// api/instagram.js

const renderURL = '';

import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // CORSヘッダーの設定
  /* 複数ドメインへの許可
  const allowedOrigins = ["https://your-site.com", "https://another-site.com"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  */
  res.setHeader("Access-Control-Allow-Origin", "https://your-site.com");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { // プリフライトリクエストの対応
    return res.status(200).end();
  }

  // Authorization ヘッダを確認
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }
  const token = authHeader.split(" ")[1];

  if (req.method === "GET") {
    // JWT 検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("UserID:", decoded.userId);

    // Instagram Graph APIを呼ぶ
    const token = process.env.INSTAGRAM_TOKEN;
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp&access_token=${token}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // 最新3件だけ返す
      const latestThree = data.data?.slice(0, 3) || [];

      res.status(200).json(latestThree);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch Instagram data." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
