// lib/auth.js
// CookieによるJWT検証

import jwt from "jsonwebtoken";

export function parseCookies(cookieHeader = "") {
  const cookies = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach(cookie => {
    const [name, ...rest] = cookie.trim().split("=");
    if (!name) return;
    cookies[name] = decodeURIComponent(rest.join("="));
  });
  return cookies;
}

export function verifyJwtFromCookies(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.token;

  if (!token) {
    throw new Error("No token");
  }

  return jwt.verify(token, process.env.JWT_SECRET);
}
