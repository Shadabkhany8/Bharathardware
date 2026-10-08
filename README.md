# 🌐 Bharat Sponge — B2B Wholesale Website (HTML/CSS/JS)

Yeh folder Bharat Sponge mobile application ka direct **Web Version** hai, jo bina kisi playstore/app store publishing ke directly link ke through customer ko WhatsApp pe share kiya ja sakta hai.

---

## 🚀 Key Highlights & Features

1. **Zero App Installation Needed**:
   - Customer ko koi app download nahi karni padegi.
   - Link pe click karte hi unke mobile browser mein fast aur modern wholesale website open ho jayegi.

2. **11 Production Products & 5 Categories**:
   - Sabhi 11 hardware abrasive products, real photos, specs, units (Box of 24, Carton of 60, etc.) aur wholesale prices pre-loaded hain.
   - **Minimum Order Quantity (MOQ) Protection**: Wholesale steppers MOQ floor se niche nahi girte.

3. **Direct WhatsApp Checkout**:
   - Customer cart mein item add karta hai, apna naam, shop/firm name aur delivery address daalta hai.
   - **"Place Order via WhatsApp"** button click karte hi customer ka WhatsApp open ho jata hai aur **Shadab Khan (+91 83052 88431)** ke number par pura formatted order invoice ready ho jata hai:
     - Sequential Order Number (`BS-2026-XXXXXX`)
     - Buyer & Shop Name
     - Delivery Address & City
     - Itemized Products (Qty, Unit Rate, Subtotal)
     - Delivery Zone Surcharge
     - Final Grand Total

4. **Indore vs Outside Indore Auto-Detection**:
   - Agar address Indore ka hai (ya pincode 452xxx), toh **Free Delivery (₹0)** lagti hai.
   - Outside Indore ke liye flat **₹250 transport surcharge** add hota hai.

5. **Perforated Invoice Receipt & Printable Challan**:
   - Order confirm hone par on-screen receipt show hoti hai with barcode visual.
   - Customer ya owner receipt ko **Print / Save PDF** bhi kar sakte hain (`Ctrl+P` / Print button).

6. **Quick WhatsApp Product Share Links**:
   - `index.html?product=1` -> Direct product detail popup open karta hai.
   - `index.html?category=1` -> Direct Abrasive category filter karta hai.
   - `index.html?cart=1` -> Direct cart drawer open karta hai.

---

## 📂 Folder Files

- **`index.html`**: Main HTML structure, hero banner, category pills, product grid, cart drawer, checkout popup, and invoice receipt modal.
- **`style.css`**: Premium industrial theme (Deep Amber `#EA580C`, Slate `#0F172A`), glassmorphism, responsive mobile cart bar, and clean print styles.
- **`app.js`**: Complete client-side logic, products data, MOQ logic, localStorage saving, WhatsApp formatting, and search filters.
- **`serve.js`**: Zero-dependency local Node.js server.

---

## 💻 How to Run & Test Locally

### Option 1: Direct Double Click
- Simply go to `BharatSponge/website/` in Windows Explorer and double click `index.html` to open in Chrome or Edge.

### Option 2: Run Local Server (Available on port 4173)
```powershell
cd website
node serve.js
```
Open in browser: **`http://localhost:4173`**

---

## 📲 WhatsApp Pe Link Share Karne Ke Free Tareeqe (Bina Kharcha / 10 Seconds)

Aapko koi playstore ya domain khareedne ki zaroorat nahi hai:

1. **Vercel / Netlify Drop (Easiest & Free)**:
   - [app.netlify.com/drop](https://app.netlify.com/drop) ya [vercel.com](https://vercel.com) par jayein.
   - `website` folder ko drag and drop kar dein.
   - 10 second mein aapko live link mil jayegi: e.g. `https://bharatsponge.netlify.app`.
   - Yeh link aap WhatsApp pe customer ko bhej sakte hain.

2. **GitHub Pages (Free Lifetime)**:
   - Repo URL: `https://github.com/Shadabkhany8/Bharathardware`
   - `.github/workflows/deploy-pages.yml` automatically `website` folder ko GitHub Pages par deploy kar deta hai.
   - GitHub repo par **Settings > Pages > Source** mein **GitHub Actions** select karein.
   - Live URL: **`https://shadabkhany8.github.io/Bharathardware/`**

