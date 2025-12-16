import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";

const db = admin.firestore();

export const createTeam = onCall(async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new Error("auth");

  const { name } = req.data;
  const teamRef = db.collection("teams").doc();
  await teamRef.set({ name, createdAt: admin.firestore.FieldValue.serverTimestamp(), owner: uid });
  await teamRef.collection("members").doc(uid).set({ role: "owner", joinedAt: admin.firestore.FieldValue.serverTimestamp() });
  return { teamId: teamRef.id };
});

export const addMember = onCall(async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new Error("auth");
  const { teamId, memberUid, role } = req.data;
  const me = await db.doc(`teams/${teamId}/members/${uid}`).get();
  if (!me.exists || me.data()?.role !== "owner") throw new Error("perm");
  await db.doc(`teams/${teamId}/members/${memberUid}`).set({ role, joinedAt: admin.firestore.FieldValue.serverTimestamp() });
  await db.collection(`teams/${teamId}/history`).add({ at: Date.now(), by: uid, action: "ADD_MEMBER", meta:{memberUid, role}});
  return { ok:true };
});
