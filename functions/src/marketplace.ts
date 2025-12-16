import * as admin from "firebase-admin";
import { onCall, onRequest } from "firebase-functions/v2/https";
import { getClientIp, hashIp } from "./utils/ip";

const db = admin.firestore();

/**
 * Creator profile: connects payout destination, identity, transparency, etc.
 * payoutProviderAccountId can be Stripe Connect / PayPal Payouts / etc.
 */
export const upsertCreatorProfile = onCall(async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new Error("auth");

  const { displayName, bio, payoutProvider, payoutProviderAccountId, termsAcceptedAt } = req.data;

  await db.doc(`creators/${uid}`).set(
    {
      uid,
      displayName: String(displayName || ""),
      bio: String(bio || ""),
      payoutProvider: String(payoutProvider || "manual"),
      payoutProviderAccountId: String(payoutProviderAccountId || ""),
      termsAcceptedAt: Number(termsAcceptedAt || Date.now()),
      updatedAt: Date.now(),
    },
    { merge: true }
  );

  await db.collection("audit").add({
    at: Date.now(),
    by: uid,
    action: "CREATOR_PROFILE_UPSERT",
    meta: { payoutProvider: String(payoutProvider || "manual") },
  });

  return { ok: true };
});

/**
 * Create/update a course. Default split: 80% creator, 20% platform.
 * You can later wire payments; right now this fully supports listing + purchase record + reporting + bans.
 */
export const upsertCourse = onCall(async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new Error("auth");

  const {
    courseId,
    title,
    description,
    priceCents,
    currency,
    visibility,
    tags,
    transparency,
  } = req.data;

  const id = courseId ? String(courseId) : db.collection("courses").doc().id;

  // Verify creator exists
  const creatorSnap = await db.doc(`creators/${uid}`).get();
  if (!creatorSnap.exists) throw new Error("creator_profile_required");

  await db.doc(`courses/${id}`).set(
    {
      id,
      ownerUid: uid,
      title: String(title || "Untitled Course"),
      description: String(description || ""),
      priceCents: Number(priceCents || 0),
      currency: String(currency || "USD"),
      visibility: String(visibility || "draft"), // draft | public | unlisted
      tags: Array.isArray(tags) ? tags.map(String) : [],
      split: { creator: 0.8, platform: 0.2 },
      transparency: {
        refundPolicy: String(transparency?.refundPolicy || "No refunds unless required by law."),
        disclosures: String(transparency?.disclosures || "Educational content only. Not financial advice."),
        proofLinks: Array.isArray(transparency?.proofLinks) ? transparency.proofLinks.map(String) : [],
      },
      updatedAt: Date.now(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  await db.collection("audit").add({
    at: Date.now(),
    by: uid,
    action: "COURSE_UPSERT",
    meta: { courseId: id },
  });

  return { ok: true, courseId: id };
});

/**
 * Record a purchase (payment integration can be added later).
 * This writes an immutable purchase record and a payout ledger row (80/20).
 */
export const createPurchase = onCall(async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new Error("auth");

  const { courseId } = req.data;
  if (!courseId) throw new Error("courseId_required");

  // Ban check
  const ban = await db.doc(`bans/${uid}`).get();
  if (ban.exists) throw new Error("banned");

  const courseSnap = await db.doc(`courses/${String(courseId)}`).get();
  if (!courseSnap.exists) throw new Error("course_not_found");
  const course = courseSnap.data() as any;

  if (course.visibility !== "public" && course.visibility !== "unlisted") {
    throw new Error("course_not_for_sale");
  }

  const purchaseId = db.collection("purchases").doc().id;

  const gross = Number(course.priceCents || 0);
  const creatorCut = Math.floor(gross * 0.8);
  const platformCut = gross - creatorCut;

  await db.doc(`purchases/${purchaseId}`).set({
    id: purchaseId,
    buyerUid: uid,
    courseId: String(courseId),
    ownerUid: course.ownerUid,
    grossCents: gross,
    currency: String(course.currency || "USD"),
    split: { creatorCents: creatorCut, platformCents: platformCut },
    status: "RECORDED", // recorded | paid | refunded
    at: Date.now(),
  });

  await db.doc(`payouts/${purchaseId}`).set({
    id: purchaseId,
    courseId: String(courseId),
    ownerUid: course.ownerUid,
    buyerUid: uid,
    creatorCents: creatorCut,
    platformCents: platformCut,
    currency: String(course.currency || "USD"),
    status: "PENDING", // pending | paid | held | reversed
    at: Date.now(),
  });

  await db.collection("audit").add({
    at: Date.now(),
    by: uid,
    action: "PURCHASE_CREATED",
    meta: { purchaseId, courseId: String(courseId) },
  });

  return { ok: true, purchaseId, grossCents: gross, creatorCents: creatorCut, platformCents: platformCut };
});

/**
 * Report a course/creator as scam or fraud.
 * Logs hashed IP + reason + evidence.
 */
export const submitReport = onRequest(async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    // Optional: if you want authenticated-only reporting, enforce Firebase ID token verification here.
    // For now: open reporting with IP hash to prevent spam.

    const { courseId, reportedUid, reason, details, evidenceLinks } = req.body || {};
    if (!courseId && !reportedUid) {
      res.status(400).send({ ok: false, error: "courseId_or_reportedUid_required" });
      return;
    }

    const ip = getClientIp(req);
    const salt = process.env.IP_HASH_SALT || "CHANGE_ME_IN_FUNCTIONS_ENV";
    const ipHash = hashIp(ip || "unknown", salt);

    const id = db.collection("reports").doc().id;

    await db.doc(`reports/${id}`).set({
      id,
      courseId: courseId ? String(courseId) : null,
      reportedUid: reportedUid ? String(reportedUid) : null,
      reason: String(reason || "SCAM"),
      details: String(details || ""),
      evidenceLinks: Array.isArray(evidenceLinks) ? evidenceLinks.map(String) : [],
      ipHash,
      userAgent: String(req.headers["user-agent"] || ""),
      at: Date.now(),
      status: "OPEN", // open | reviewed | actioned | dismissed
    });

    await db.collection("audit").add({
      at: Date.now(),
      by: "anonymous",
      action: "REPORT_SUBMITTED",
      meta: { reportId: id, courseId: courseId ? String(courseId) : null, reportedUid: reportedUid ? String(reportedUid) : null },
    });

    res.send({ ok: true, reportId: id });
  } catch (e: any) {
    res.status(500).send({ ok: false, error: e?.message || "error" });
  }
});

/**
 * Admin action: ban a user (holds payouts, blocks purchases).
 * Requires customClaims.admin = true.
 */
export const adminBanUser = onCall(async (req) => {
  const adminUid = req.auth?.uid;
  if (!adminUid) throw new Error("auth");

  const me = await admin.auth().getUser(adminUid);
  if (!me.customClaims?.admin) throw new Error("perm_admin_only");

  const { uidToBan, reason, durationDays } = req.data;
  if (!uidToBan) throw new Error("uidToBan_required");

  const until = durationDays ? Date.now() + Number(durationDays) * 24 * 60 * 60 * 1000 : null;

  await db.doc(`bans/${String(uidToBan)}`).set({
    uid: String(uidToBan),
    reason: String(reason || "Policy violation / scam reports"),
    until,
    by: adminUid,
    at: Date.now(),
  });

  // Optional: put payouts on HOLD
  const payoutsSnap = await db.collection("payouts").where("ownerUid", "==", String(uidToBan)).where("status", "==", "PENDING").get();
  const batch = db.batch();
  payoutsSnap.docs.forEach(d => batch.update(d.ref, { status: "HELD" }));
  await batch.commit();

  await db.collection("audit").add({
    at: Date.now(),
    by: adminUid,
    action: "USER_BANNED",
    meta: { uidToBan: String(uidToBan), until },
  });

  return { ok: true };
});
