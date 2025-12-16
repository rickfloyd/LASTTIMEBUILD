import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Entitlements, subscribeEntitlements } from "../services/entitlements";

type EntitlementsState = {
  loading: boolean;
  uid: string | null;
  entitlements: Entitlements | null;
};

const Ctx = createContext<EntitlementsState>({
  loading: true,
  uid: null,
  entitlements: null,
});

export function EntitlementsProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
      setEntitlements(null);
      setLoading(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    const unsubEnt = subscribeEntitlements(
      uid,
      (data) => {
        setEntitlements(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubEnt();
  }, [uid]);

  const value = useMemo(() => ({ loading, uid, entitlements }), [loading, uid, entitlements]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEntitlements() {
  return useContext(Ctx);
}
