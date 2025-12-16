import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";
const db = admin.firestore();

export const revokeAllSessions = onCall(async (req)=>{
  const uid=req.auth?.uid; if(!uid) throw new Error("auth");
  await admin.auth().revokeRefreshTokens(uid);
  await db.collection(`users/${uid}/private/security_events`).add({
    at: Date.now(), type:"REVOKE_ALL", by: uid
  });
  return {ok:true};
});
