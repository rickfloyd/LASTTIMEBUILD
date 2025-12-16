import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

export async function resolveSymbol(input: string) {
  const fn = httpsCallable(functions, "resolveSymbol");
  const res = await fn({ input });
  return res.data as any;
}
