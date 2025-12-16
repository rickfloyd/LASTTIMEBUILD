import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";

const db = admin.firestore();

/**
 * Daily ingest job:
 * - pulls from configured sources (admin/crypto_sources)
 * - currently supports "bitpay_directory" fetch-and-parse (best-effort)
 *
 * IMPORTANT:
 * - This is a "best-effort" parser. Merchants should still be reviewed by admin.
 */
export const ingestCryptoMerchantsDaily = onSchedule("every day 03:17", async () => {
  const sourcesSnap = await db.collection("admin").doc("crypto_sources").collection("items").get();
  const sources = sourcesSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));

  const runId = db.collection("admin").doc("crypto_ingest_runs").collection("runs").doc().id;
  const runRef = db.collection("admin").doc("crypto_ingest_runs").collection("runs").doc(runId);

  const runLog: any = {
    id: runId,
    at: Date.now(),
    sources: sources.map(s => s.id),
    added: 0,
    updated: 0,
    errors: [],
  };

  try {
    for (const src of sources) {
      if (src.enabled !== true) continue;

      if (src.kind === "bitpay_directory") {
        const addedUpdated = await ingestBitPayDirectory(src.url);
        runLog.added += addedUpdated.added;
        runLog.updated += addedUpdated.updated;
      }
    }
  } catch (e: any) {
    runLog.errors.push(String(e?.message || e));
  }

  await runRef.set(runLog, { merge: false });
});

async function ingestBitPayDirectory(url: string) {
  // Uses Node 18/20 global fetch in Cloud Functions runtime.
  const r = await fetch(url, { method: "GET" });
  const html = await r.text();

  /**
   * Best-effort parsing:
   * Grab anchors that look like merchant cards. If BitPay changes markup, this may break.
   * We intentionally treat this as "suggestions" and store with active=false until reviewed.
   */
  const matches = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];

  let added = 0;
  let updated = 0;

  // crude filtering: keep likely external merchant URLs
  const candidates = matches
    .map(m => ({ href: m[1], inner: m[2] }))
    .filter(x => x.href.startsWith("http"))
    .slice(0, 600);

  for (const c of candidates) {
    // Try derive name by stripping tags
    const name = stripTags(c.inner).replace(/\s+/g, " ").trim();
    if (!name || name.length < 2 || name.length > 80) continue;

    const website = c.href;

    const id = stableId(name, website);
    const ref = db.collection("crypto_merchants").doc(id);

    const payload = {
      id,
      name,
      website,
      category: "Unknown",
      countries: ["Global"],
      coins: ["BTC", "ETH", "USDC", "USDT"],
      acceptanceType: "processor",
      processor: "BitPay",
      verifiedSource: url,
      notes: "Auto-ingested (needs admin review)",
      active: false, // ADMIN REVIEW REQUIRED
      updatedAt: Date.now(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const existing = await ref.get();
    if (!existing.exists) {
      await ref.set(payload, { merge: false });
      added++;
    } else {
      await ref.set(payload, { merge: true });
      updated++;
    }
  }

  return { added, updated };
}

function stripTags(s: string) {
  return s.replace(/<[^>]*>/g, "");
}

function stableId(name: string, website: string) {
  const base = (name + "|" + website).toLowerCase().replace(/[^a-z0-9|]+/g, "-").slice(0, 80);
  // Firestore doc IDs can be longer; we keep short + deterministic.
  return "bp_" + base.replace(/\|/g, "__");
}
