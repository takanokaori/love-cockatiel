// api/instagram.js

import { verifyJwtFromCookies } from "@/lib/auth";

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

    try {
      // Cookie認証
      const decoded = verifyJwtFromCookies(req);
      console.log("User info:", decoded);
      if (!decoded) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Instagram Graph APIを呼ぶ
      const instagramToken = process.env.INSTAGRAM_TOKEN;
      const url = `https://graph.facebook.com/v23.0/me?fields=id,caption,media_url,permalink,timestamp&access_token=${instagramToken}`;

      const response = await fetch(url);
      const data = await response.json();

      // 最新3件だけ返す
      const latestThree = data.data?.slice(0, 3) || [];

      res.status(200).json(latestThree);
    } catch (err) {
      console.error(err);
      return res.status(401).json({ success: false, error: err.message || "Unauthorized" });
    }

  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
