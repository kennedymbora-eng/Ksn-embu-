// inventory.js
import { db } from "./firebase-config.js";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function inventoryRef(shopId) {
  return collection(db, "shops", shopId, "inventory");
}

function restockRef(shopId) {
  return collection(db, "shops", shopId, "restockList");
}

export function stockStatus(stock, minStock) {
  if (stock <= 0) return "out";        // 🔴 Out of Stock
  if (stock <= minStock) return "low"; // 🟡 Low Stock
  return "ok";                          // 🟢 In Stock
}

export async function addProduct(shopId, product) {
  await addDoc(inventoryRef(shopId), {
    name: product.name,
    category: product.category,
    brand: product.brand || "",
    buyPrice: Number(product.buyPrice) || 0,
    sellPrice: Number(product.sellPrice) || 0,
    stock: Number(product.stock) || 0,
    minStock: Number(product.minStock) || 0,
    barcode: product.barcode || "",
    supplier: product.supplier || "",
    createdAt: serverTimestamp()
  });
}

export async function updateStock(shopId, productId, newStock) {
  await setDoc(
    doc(db, "shops", shopId, "inventory", productId),
    { stock: Number(newStock) },
    { merge: true }
  );
}

export async function deleteProduct(shopId, productId) {
  await deleteDoc(doc(db, "shops", shopId, "inventory", productId));
}

// Live-listen to inventory, callback fires with an array of products on every change
export function watchInventory(shopId, callback) {
  const q = query(inventoryRef(shopId), orderBy("name"));
  return onSnapshot(q, (snap) => {
    const products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(products);
  });
}

export async function addToRestockList(shopId, product, quantity) {
  await addDoc(restockRef(shopId), {
    productId: product.id,
    name: product.name,
    quantity: Number(quantity) || 1,
    addedAt: serverTimestamp()
  });
}

export async function removeFromRestockList(shopId, restockItemId) {
  await deleteDoc(doc(db, "shops", shopId, "restockList", restockItemId));
}

export function watchRestockList(shopId, callback) {
  return onSnapshot(restockRef(shopId), (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

// Submits the restock list as an order, then clears the list
export async function submitRestockOrder(shopId, items) {
  const ordersRef = collection(db, "orders");
  await addDoc(ordersRef, {
    shopId,
    items: items.map((i) => ({ productId: i.productId, name: i.name, quantity: i.quantity })),
    status: "pending",
    submittedForAggregation: true,
    createdAt: serverTimestamp()
  });

  await Promise.all(items.map((i) => removeFromRestockList(shopId, i.id)));
}
