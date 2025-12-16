import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { uid } from "../lib/uid";
import { OrderEvent, OrderRecord, OrderRequest, OrderState } from "../types/orders";

async function writeOrder(uidUser: string, rec: OrderRecord) {
  await setDoc(doc(db, `users/${uidUser}/private/orders/${rec.id}`), rec, { merge: true });
}

async function writeEvent(uidUser: string, ev: OrderEvent) {
  await setDoc(doc(collection(db, `users/${uidUser}/private/order_events`)), ev, { merge: false });
}

/**
 * Sandbox adapter: simulates broker ACK/FILL deterministically.
 * Replace this later with MT5/REST/WebSocket bridge.
 */
export async function placeOrder(uidUser: string, broker: string, req: Omit<OrderRequest, "id" | "createdAt">) {
  const orderId = uid();
  const request: OrderRequest = { ...req, id: orderId, createdAt: Date.now() };

  const rec: OrderRecord = {
    id: orderId,
    broker,
    request,
    state: "CREATED",
    lastMessage: "Order created",
    updatedAt: Date.now(),
  };

  await writeOrder(uidUser, rec);
  await writeEvent(uidUser, { id: uid(), orderId, at: Date.now(), state: "CREATED", message: "Created" });

  // SENT
  rec.state = "SENT";
  rec.lastMessage = "Sent to broker adapter";
  rec.updatedAt = Date.now();
  await writeOrder(uidUser, rec);
  await writeEvent(uidUser, { id: uid(), orderId, at: Date.now(), state: "SENT", message: "Sent" });

  // ACK then FILL (simple deterministic timing)
  const ok = request.qty > 0 && !!request.symbol;
  if (!ok) {
    rec.state = "REJECTED";
    rec.lastMessage = "Rejected: invalid request";
    rec.updatedAt = Date.now();
    await writeOrder(uidUser, rec);
    await writeEvent(uidUser, { id: uid(), orderId, at: Date.now(), state: "REJECTED", message: rec.lastMessage });
    return rec;
  }

  rec.state = "ACKED";
  rec.lastMessage = "Broker ACK";
  rec.updatedAt = Date.now();
  await writeOrder(uidUser, rec);
  await writeEvent(uidUser, { id: uid(), orderId, at: Date.now(), state: "ACKED", message: "ACK" });

  rec.state = "FILLED";
  rec.lastMessage = "Filled (sandbox)";
  rec.updatedAt = Date.now();
  await writeOrder(uidUser, rec);
  await writeEvent(uidUser, { id: uid(), orderId, at: Date.now(), state: "FILLED", message: "Filled (sandbox)" });

  return rec;
}
