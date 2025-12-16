import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

export default function SecurityCenter(){
  const revoke=()=>httpsCallable(functions,"revokeAllSessions")({});
  return (
    <div className="p-4 border border-white/10 rounded-xl bg-black/40">
      <div className="text-white font-semibold">28) Security Center</div>
      <button className="mt-3 w-full p-2 bg-red-500/20 text-white" onClick={revoke}>
        Revoke All Sessions
      </button>
    </div>
  );
}
