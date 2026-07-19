# Krystal Supply Network — v1.0 skeleton

Shop registration, login, inventory tracking with low-stock alerts, and a restock list that submits into a shared `orders` collection ready for aggregation.

## Setup

1. **Create a Firebase project**
   - Go to https://console.firebase.google.com → Add project
   - Enable **Authentication → Email/Password** sign-in method
   - Enable **Firestore Database** (start in production mode)

2. **Get your config**
   - Project Settings → Your apps → Add app → Web
   - Copy the config values into `js/firebase-config.js`

3. **Deploy Firestore rules**
   - Install Firebase CLI: `npm install -g firebase-tools`
   - `firebase login`
   - `firebase init firestore` (point it at this folder, use the existing `firestore.rules`)
   - `firebase deploy --only firestore:rules`

4. **Run locally / deploy**
   - This is a static site — no build step. Push to GitHub Pages or Vercel as-is.
   - For local testing, any static server works, e.g. `python3 -m http.server`

## What's here (v1.0 scope)

- `index.html` — landing page
- `register.html` / `login.html` — shop auth, backed by Firebase Auth
- `dashboard.html` — inventory CRUD, live low/out-of-stock stats, restock list, order submission
- `js/firebase-config.js` — your Firebase keys (fill in)
- `js/auth.js` — registration/login/logout logic
- `js/inventory.js` — inventory + restock list + order submission logic
- `firestore.rules` — locks each shop to its own data

## Data model

```
shops/{shopId}                    — profile: name, owner, phone, location, shopCode
shops/{shopId}/inventory/{id}     — product: name, category, stock, minStock, buyPrice, sellPrice
shops/{shopId}/restockList/{id}   — pending restock item: name, quantity
orders/{orderId}                  — submitted order: shopId, items[], status
```

## Admin dashboard (v2.0)

`admin.html` shows every registered shop, all pending orders, and a **combined purchase list** — quantities summed across shops for each product, with a breakdown of which shop wants how much.

**To make your account the admin:**
1. Register a normal shop account for yourself (or use an existing one) so it exists in Firebase Auth.
2. In the Firebase Console → Firestore Database, manually create a collection called `admins`.
3. Add a document whose **document ID is your account's Firebase Auth UID** (find this in Authentication → Users). The document's contents don't matter — its existence is what grants access (see `firestore.rules`).
4. Log in with that account and open `admin.html` — you'll now see data across all shops. Any other account will just see empty tables, since Firestore rules block non-admins from reading other shops' data.

When you're ready to buy, review the combined list, do the actual Nairobi purchase, then click **"Mark all as purchased"** to close out those orders.

## Next steps (v3.0)

- Purchase order generation (printable/PDF) from the combined list
- Delivery status tracking (purchased → in transit → delivered)
- Invoices back to each shop once their portion arrives
- M-Pesa payment integration
