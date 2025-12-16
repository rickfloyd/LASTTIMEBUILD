import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
export const createTeam = (name:string)=>httpsCallable(functions,"createTeam")({name});
export const addMember = (teamId:string, memberUid:string, role:string)=>
  httpsCallable(functions,"addMember")({teamId, memberUid, role});
