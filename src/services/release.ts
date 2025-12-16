import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
export const watchRelease=(cb:(r:any)=>void)=>onSnapshot(doc(db,"releases/current"),s=>cb(s.data()));
