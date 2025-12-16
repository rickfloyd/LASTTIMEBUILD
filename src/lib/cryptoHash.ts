export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

export function stableStringify(obj: any): string {
  const seen = new WeakSet();
  return JSON.stringify(obj, function (key, value) {
    if (value && typeof value === "object") {
      if (seen.has(value)) return;
      seen.add(value);
      if (Array.isArray(value)) return value;
      return Object.keys(value).sort().reduce((acc: any, k) => (acc[k] = (value as any)[k], acc), {});
    }
    return value;
  });
}
