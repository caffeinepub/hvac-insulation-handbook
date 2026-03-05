# HVAC & Insulation Handbook

## Current State
The app has 6 tabs: Handbook (7 HVAC sections), Brief History, Sales Tips, In Home Process, Checklist, and Calendar. Each tab renders a full-page content component. The tab type `TabView` is a union of string literals. The `TabBar` component renders all tabs from a local array.

## Requested Changes (Diff)

### Add
- A new `"financial"` tab value to the `TabView` union
- A `FinancialAssistantPage` component with lengthy, organized, categorized financial content including:
  - Stock Market Terms (20+ terms: bull/bear market, P/E ratio, dividend, market cap, IPO, etc.)
  - Cryptocurrency Terms & Advice (Bitcoin, Ethereum, altcoins, wallets, DeFi, staking, etc.)
  - Derivatives (futures, options, puts/calls, swaps, leverage, hedging, etc.)
  - Long vs. Short Explained (mechanics, margin, short squeeze, etc.)
  - Economic Indicators & Facts (GDP, CPI/inflation, federal funds rate, yield curve, recession, etc.)
  - General Investing Principles (diversification, dollar-cost averaging, risk tolerance, etc.)
- A "Financial Assistant" tab entry in the `TabBar`, positioned after the Calendar tab
- A content render block in the main App for `activeTab === "financial"`

### Modify
- `TabView` type: add `"financial"` to the union
- `TabBar` tabs array: add Financial Assistant entry with an appropriate icon (e.g. `DollarSign` from lucide-react)

### Remove
- Nothing removed

## Implementation Plan
1. Add `"financial"` to the `TabView` union type
2. Import `DollarSign` (or similar) icon from lucide-react
3. Write `FINANCIAL_CATEGORIES` static data array covering 6 categories, each with 10–20+ term entries (term name + definition paragraph)
4. Write `FinancialAssistantPage` component matching the visual style of other pages (header with icon, category sections with numbered entries, rule dividers, motion animations, data-ocid markers)
5. Add Financial Assistant tab to the `TabBar` tabs array
6. Add the `activeTab === "financial"` render block in main `App`, including footer
