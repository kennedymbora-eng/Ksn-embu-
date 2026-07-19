// auth.js
import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Generates a short shop code like "KSN-7F2A"
function generateShopCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `KSN-${code}`;
}

export async function registerShop({ shopName, ownerName, phone, email, location, password }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const shopId = cred.user.uid;
  const shopCode = generateShopCode();

  await setDoc(doc(db, "shops", shopId), {
    shopName,
    ownerName,
    phone,
    email,
    location,
    shopCode,
    status: "active",
    createdAt: serverTimestamp()
  });

  return { shopId, shopCode };
}

export async function loginShop(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export function logout() {
  return signOut(auth);
}

export function watchAuthState(onLogin, onLogout) {
  onAuthStateChanged(auth, (user) => {
    if (user) onLogin(user);
    else onLogout();
  });
}
