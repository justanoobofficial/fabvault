# THE FAB VAULT

Storefront for a premium thrift archive. Brutalist editorial layout, oversized serif
typography, GSAP masks, Lenis scroll, Firestore inventory and a dual Paystack /
WhatsApp checkout.

Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, Firebase (Firestore),
react-paystack, lucide-react, lenis, gsap, framer-motion.

---

## 1. Install

```bash
npm install
```

Then run it:

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm start
```

## 2. Environment

Copy `.env.local.example` to `.env.local` and fill it in:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=
FIREBASE_SERVICE_ACCOUNT_JSON=
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
IMAGEKIT_PRIVATE_KEY=
```

Without Firebase keys the storefront shows its branded empty state. For live card
payments, configure the Paystack public key and the server-only secret key. Never
place the Paystack secret in a NEXT_PUBLIC variable.

## 3. Firestore

Two collections, no schema migrations needed.

`products`

| field     | type      | notes                                  |
| --------- | --------- | -------------------------------------- |
| name      | string    | upper case in the UI                   |
| price     | number    | naira, whole numbers                   |
| image     | string    | any public image URL                   |
| category  | string    | drives the catalogue filters           |
| sizes     | string[]  | optional, defaults to `OS`             |
| tag       | string    | optional ribbon, e.g. `DEADSTOCK`      |
| soldOut   | boolean   | shows the "Vaulted" plate              |
| createdAt | timestamp | newest first                          |

`orders`

| field     | type      | notes                                  |
| --------- | --------- | -------------------------------------- |
| reference | string    | Paystack reference or `FV-...-WA`      |
| email     | string    | receipt address                        |
| customer  | string    | name from the drawer                   |
| items     | array     | `{ id, name, price, size, quantity }`  |
| subtotal  | number    | naira                                  |
| channel   | string    | `paystack` or `whatsapp`               |
| status    | string    | `paid` or `pending`                    |
| createdAt | timestamp | unix ms                                |

Deploy `firestore.rules` (included) in Firebase Console. Product reads remain
public, but product writes and order reads require a verified Firebase Auth user
whose email is support.fabuyodevs@gmail.com. Enable Email/Password in Firebase
Authentication and create/verify that admin account. WhatsApp orders can only be
created as pending enquiries; paid orders must be recorded by the server after
Paystack verification.

### Seeding

Two options:

1. `/admin-secure-99` and add pieces by hand. Fastest for real inventory.
2. Seed products manually through the authenticated console. The old public seed
   route has been removed so unauthenticated visitors cannot write inventory.

## 4. Admin

- Route: `/admin-secure-99` (unlinked, excluded from metadata indexing)
- Sign-in: Firebase Authentication (verified admin email only)
- Inventory tab: name, price, image URL, category, sizes, tag, delete
- Orders tab: every order record, filterable by channel, paid volume summary
- Footer: `Admin: support.fabuyodevs@gmail.com`

The passphrase is compared on the client and stored in `sessionStorage`. That hides
the console from customers, it does not secure the database. See the note above.

## 5. Checkout

- **WhatsApp**: builds a formatted breakdown and opens `wa.me/2349125310881`,
  logging the order as `pending`.
- **Paystack**: inline checkout uses the public key. The server verifies the
  transaction with Paystack before creating a paid order. Configure the server-only
  `PAYSTACK_SECRET_KEY` and Firebase service account JSON before enabling it.

## 6. Routes

| route                    | purpose                                     |
| ------------------------ | ------------------------------------------- |
| `/`                      | hero, position, vault preview, manifesto    |
| `/catalogue`             | full archive with category filters          |
| `/privacy-policy`        | legal document 01                           |
| `/terms-and-conditions`  | legal document 02                           |
| `/admin-secure-99`       | console                                     |
| `/admin-secure-99/seed`  | one click demo seeding                      |
| `/preview-grid`          | design reference for the product grid states |

`/preview-grid` renders the product cards against the local seed file so the hover,
tilt and quick add states can be reviewed without a database. Safe to delete.

## 7. Motion inventory

- Scroll lock: `is-intro` ships in the server HTML, so the document is frozen at
  first paint. Lenis is constructed stopped and only started after the curtain
  clears, which also forces `window.scrollTo(0, 0)`
- Lenis smooth scroll, driven by the GSAP ticker and synced to ScrollTrigger
- Custom cursor: spring dot plus a trailing ring in `mix-blend-difference` that
  expands and snaps to product cards (`data-cursor="snap"`) and links
- Magnetic elements via `data-magnetic`
- Preloader: black curtain, counter, masked wordmark, slides up and reveals
- Hero: masked line reveal, image scale and blur out, scroll parallax
- Clip path reveals (ScrollTrigger) on the position plate and on every product
  card, driven from a separate media node so the tilt transform never fights it
- Magnetic wrapper used by Sell to the Vault, the enquiry pair, the checkout
  buttons and the newsletter submit. The label counter-moves for depth
- Catalogue: 3:4 grid, hover zoom to 1.05, VIEW ITEM plate, backlit quick add
  bar, 3D tilt on pointer move
- Cart: spring drawer in `#111` with inverted type, field level validation
- Manifesto: word by word scrub reveal
- Marquee: pure CSS rails, two halves translating exactly minus fifty percent so
  the loop has no seam. Hover pauses the rail
- `prefers-reduced-motion` is respected by Lenis; the grain overlay stops moving

## 8. Copy rules used in this build

Stark and declarative. No em dashes, no emoji, no invented review counts or
"trusted by" strips, no metrics that do not exist. Icons come from lucide-react only.

## 9. Reference frames

`preview/` holds captured frames of the build at 1440 wide plus one mobile shot:

- `00-preloader.png` counter curtain
- `01-hero.png` masked hero at rest
- `02-grid-hover.png` card hover with the quick add bar and the snapped cursor
- `03-cart.png` cart drawer in dark mode
- `04-mobile.png` 390 wide hero
