import * as crypto from "crypto";

export function getClientIp(req: any): string {
  const xf = (req.headers["x-forwarded-for"] || req.headers["X-Forwarded-For"]) as string | undefined;
  if (xf) return xf.split(",")[0].trim();
  return (req.ip || req.rawConnection?.remoteAddress || "") as string;
}

export function hashIp(ip: string, salt: string): string {
  return crypto.createHmac("sha256", salt).update(ip).digest("hex");
}
