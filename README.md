# Modern Asset Zakat & Ethical Wealth Tax Engine

> Deterministic, AAOIFI-compliant wealth audit and Zakat computation engine engineered for modern tech compensation (RSUs, ESPP), locked retirement funds (EPF/VPF/401k), and Web3 portfolios.

[![Live App](https://img.shields.io/badge/Live-zakat--wealth--engine.vercel.app-10b981)](https://zakat-wealth-engine.vercel.app)
[![Standard](https://img.shields.io/badge/Fiqh%20Standard-AAOIFI%20No.%2035-blue)](https://aaoifi.com)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side-emerald)](#privacy--security-guarantee)

---

## Key Technical & Fiqh Features

- **Unvested RSUs (0% Weight):** Strictly adheres to the *Milkiyyah Tammah* (complete legal ownership) principle. Unvested grants carry zero liability until actual vesting occurs.
- **Long-Term Equities (25% Proxy):** Implements the AAOIFI working-capital proxy for passive/long-term tech holdings rather than taxing gross market valuation.
- **Retirement & Locked Funds (EPF / VPF / 401k):** Segregates inaccessible corpus from liquid/withdrawable funds.
- **Dynamic Spot Rates:** Live bullion rates (Gold/Silver in INR, USD, AED, GBP, EUR) with manual local override.
- **Institutional PDF Audit:** Deterministic line-item audit report generation with SHA-256 cryptographic verification.

---

## Privacy & Security Guarantee

- **Zero Database Storage:** No server-side persistence. All inputs remain strictly in browser memory.
- **No Analytics Fingerprinting:** Financial calculations are never tracked or logged.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Document Generation:** @react-pdf/renderer
- **State Management:** Zustand (session-based)

---

## Local Development

Run the development server locally:

npm install
npm run dev

Open http://localhost:3000 in your browser.
