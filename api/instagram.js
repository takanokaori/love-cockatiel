// api/instagram.js

import { verifyJwtFromCookies } from "../lib/auth.js";

export default async function handler(req, res) {
  // 他サイトからの呼び出し（CORSヘッダーの設定）
  /* 複数ドメインへの許可
  const allowedOrigins = ["https://your-site.com", "https://another-site.com"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  */
  // res.setHeader("Access-Control-Allow-Origin", "https://your-site.com");
  // res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // if (req.method === "OPTIONS") { // プリフライトリクエスト
  //   return res.status(200).end();
  // }

  if (req.method === "GET") {
    // Cookie認証
    const decoded = verifyJwtFromCookies(req);
    if (!decoded) {
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

      // 最新3件だけ返す
      const latestThree = data.media?.data?.slice(0, 3) || [];
      return res.json(latestThree);
    } catch (err) {
      return res.status(500).json({ error: "Instagram API error ( Instagram Graph API )" });
    }

  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
