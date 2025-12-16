import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";
const db=admin.firestore();

export const setRelease = onCall(async(req)=>{
  const uid=req.auth?.uid; if(!uid) throw new Error("auth");
  const me=await admin.auth().getUser(uid);
  if(!(me.customClaims?.admin)) throw new Error("perm");
  const {version,channel}=req.data;
  await db.doc("releases/current").set({version,channel,at:Date.now()});
  return {ok:true};
});
