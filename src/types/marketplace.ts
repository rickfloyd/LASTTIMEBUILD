FIRESTORE SCHEMA
crypto_merchants/{merchantId}
crypto_merchants/{merchantId}/reports/{reportId}

admin/crypto_sources/{sourceId}

2️⃣ BACKEND — Firebase Functions
✅ functions/src/cryptoDirectory.ts
import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";

const db = admin.firestore();

/**
 * Admin-only: add or update a merchant
 */
export const upsertCryptoMerchant = onCall(async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new Error("auth");

  const user = await admin.auth().getUser(uid);
  if (!user.customClaims?.admin) throw new Error("admin_only");

  const {
    merchantId,
    name,
    website,
    category,
    countries,
    coins,
    acceptanceType, // direct | giftcard | processor
    processor,      // BitPay | CoinbaseCommerce | NOWPayments | etc
    verifiedSource, // URL where verified
    notes
  } = req.data;

  const id = merchantId || db.collection("crypto_merchants").doc().id;

  await db.doc(`crypto_merchants/${id}`).set({
    id,
    name,
    website,
    category,
    countries,
    coins,
    acceptanceType,
    processor,
    verifiedSource,
    notes: notes || "",
    active: true,
    updatedAt: Date.now(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  return { ok: true, merchantId: id };
});

/**
 * Public: report a merchant as scam / outdated
 */
export const reportCryptoMerchant = onCall(async (req) => {
  const uid = req.auth?.uid || "anonymous";
  const { merchantId, reason, details } = req.data;
  if (!merchantId) throw new Error("merchantId_required");

  await db.collection(`crypto_merchants/${merchantId}/reports`).add({
    by: uid,
    reason,
    details: details || "",
    at: Date.now(),
    status: "OPEN",
  });

  return { ok: true };
});

✅ functions/src/index.ts
export { upsertCryptoMerchant, reportCryptoMerchant } from "./cryptoDirectory";

3️⃣ FIRESTORE RULES (SAFE + CLEAN)
match /crypto_merchants/{merchantId} {
  allow read: if resource.data.active == true;
  allow write: if request.auth != null && request.auth.token.admin == true;

  match /reports/{reportId} {
    allow write: if true;
    allow read: if request.auth != null && request.auth.token.admin == true;
  }
}

4️⃣ FRONTEND SERVICES
✅ src/services/cryptoDirectory.ts
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../firebase";

export function subscribeCryptoMerchants(cb:(rows:any[])=>void) {
  const q = query(
    collection(db, "crypto_merchants"),
    where("active", "==", true)
  );
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => d.data()));
  });
}

export async function reportMerchant(merchantId:string, reason:string, details:string){
  const fn = httpsCallable(functions, "reportCryptoMerchant");
  return fn({ merchantId, reason, details });
}

5️⃣ UI COMPONENT — DIRECTORY PAGE
✅ src/components/CryptoAcceptanceDirectory.tsx
import { useEffect, useState } from "react";
import { subscribeCryptoMerchants, reportMerchant } from "../services/cryptoDirectory";

export default function CryptoAcceptanceDirectory() {
  const [rows, setRows] = useState<any[]>([]);
  const [filterCoin, setFilterCoin] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    return subscribeCryptoMerchants(setRows);
  }, []);

  const filtered = rows.filter(r =>
    (!filterCoin || r.coins.includes(filterCoin)) &&
    (!filterCategory || r.category === filterCategory)
  );

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="text-2xl font-bold text-white mb-4">
        Crypto Acceptance Directory
      </div>

      <div className="flex gap-2 mb-4">
        <select onChange={e=>setFilterCoin(e.target.value)}
          className="bg-black border p-2 text-white">
          <option value="">All Coins</option>
          <option>BTC</option>
          <option>ETH</option>
          <option>USDC</option>
          <option>USDT</option>
          <option>SOL</option>
        </select>

        <select onChange={e=>setFilterCategory(e.target.value)}
          className="bg-black border p-2 text-white">
          <option value="">All Categories</option>
          <option>Retail</option>
          <option>Travel</option>
          <option>Software</option>
          <option>Luxury</option>
          <option>Services</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(m => (
          <div key={m.id}
            className="border border-white/10 rounded-xl p-4 bg-black/40">
            <div className="text-lg text-white font-semibold">{m.name}</div>
            <a href={m.website} target="_blank"
              className="text-cyan-400 text-sm">{m.website}</a>

            <div className="text-xs text-white/70 mt-1">
              Category: {m.category}
            </div>

            <div className="text-xs text-white/70">
              Coins: {m.coins.join(", ")}
            </div>

            <div className="text-xs text-white/70">
              Acceptance: {m.acceptanceType}
              {m.processor && ` (${m.processor})`}
            </div>

            <div className="text-xs text-white/50 mt-1">
              Verified via: {m.verifiedSource}
            </div>

            <button
              onClick={()=>reportMerchant(m.id,"SCAM","Suspicious activity")}
              className="mt-2 text-xs text-red-400 underline">
              Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

6️⃣ WIRE INTO AI QUANTUM CHARTS
✅ src/App.tsx
import CryptoAcceptanceDirectory from "./components/CryptoAcceptanceDirectory";

<CryptoAcceptanceDirectory />export type CreatorProfile = {
  uid: string;
  displayName: string;
  bio: string;
  payoutProvider: string;
  payoutProviderAccountId: string;
  termsAcceptedAt: number;
  updatedAt: number;
};

export type Course = {
  id: string;
  ownerUid: string;
  title: string;
  description: string;
  priceCents: number;
  currency: string;
  visibility: "draft" | "public" | "unlisted";
  tags: string[];
  split: { creator: number; platform: number };
  transparency: {
    refundPolicy: string;
    disclosures: string;
    proofLinks: string[];
  };
  updatedAt: number;
};

export type PurchaseReceipt = {
  purchaseId: string;
  grossCents: number;
  creatorCents: number;
  platformCents: number;
};
