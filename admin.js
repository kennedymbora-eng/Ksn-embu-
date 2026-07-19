// admin.js
import { db } from "./firebase-config.js";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export function watchAllShops(callback) {
  return onSnapshot(collection(db, "shops"), (snap) => {
    const shops = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(shops);
  });
}

// Live-watch every order that hasn't been purchased yet
export function watchPendingOrders(callback) {
  const q = query(
    collection(db, "orders"),
    where("status", "==", "pending"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(orders);
  });
}

// Combines quantities for the same product name across every pending order
export function aggregateOrders(orders) {
  const combined = {}; // productName -> { total, breakdown: [{shopId, quantity, orderId}] }

  for (const order of orders) {
    for (const item of order.items || []) {
      const key = item.name.trim().toLowerCase();
      if (!combined[key]) {
        combined[key] = { name: item.name, total: 0, breakdown: [] };
      }
      combined[key].total += Number(item.quantity) || 0;
      combined[key].breakdown.push({
        shopId: order.shopId,
        quantity: item.quantity,
        orderId: order.id
      });
    }
  }

  return Object.values(combined).sort((a, b) => b.total - a.total);
}

export async function markOrdersPurchased(orderIds) {
  await Promise.all(
    orderIds.map((id) => updateDoc(doc(db, "orders", id), { status: "purchased" }))
  );
}
