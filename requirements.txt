# Build HI ONE TECH — Waterproofing Quotation Management Website

## Role
Act as a senior React developer and UI/UX designer. Build a complete, reliable, simple single-page quotation management website for a waterproofing company named **HI ONE TECH**.

## Objective
Create a professional quotation tool that allows staff to enter customer and project details, add multiple waterproofing work items, calculate prices automatically, save and manage old quotations, and print or save quotations as A4 PDFs.

This is a practical business application, not a marketing website.

## Technology
- React + Vite
- JavaScript
- Tailwind CSS
- Browser LocalStorage
- CSS print media queries
- Browser-native Print API

First inspect the existing project files and package configuration. Reuse the existing structure if a project already exists. Do not overwrite working files unnecessarily.

## UI Requirements
Create a clean, professional interface with:
- Navy blue, white and subtle grey styling
- Clear typography and consistent spacing
- Responsive mobile and desktop layouts
- A simple company header showing HI ONE TECH
- English/Tamil language switcher
- Clearly labelled form fields
- Accessible buttons, keyboard navigation and validation messages

Avoid unnecessary animations, oversized cards and complex navigation.

## Main Features

### 1. Company Details
- Company name: HI ONE TECH
- Optional logo, address, phone number, email and GSTIN
- Editable company contact details through a simple settings area
- Persist company settings locally

Do not invent actual company contact details, GSTIN or logo.

### 2. Quotation Details
- Automatically generated unique quotation number using format HOT-YYYY-001
- Quotation date
- Optional validity date
- Draft/final status
- Never reuse an existing quotation number, including after deletion

### 3. Customer Details
- Customer name
- Phone number
- Project location/place
- Site address
- Optional customer reference

### 4. Work Items
Allow adding, editing and deleting multiple rows.

Each row must contain:
- Work description
- Quantity/area
- Unit selector: sq.ft, sq.m, running ft, number or other
- Rate per unit
- Automatically calculated line amount

Formula: line amount = quantity × rate.

Provide an Add Item button and a clear empty-state message.

### 5. Price Calculation
Display:
- Subtotal
- Discount as a fixed amount or percentage
- Optional configurable tax/GST
- Grand total
- Advance received
- Balance due

Formulas:
- Subtotal = sum of line amounts
- Discount amount = fixed discount or percentage of subtotal
- Grand total = subtotal − discount + applicable tax
- Balance due = grand total − advance

Validate all inputs, prevent negative totals and round displayed amounts to two decimal places. Tax must be optional and disabled by default. Do not claim a tax rate is legally applicable without confirmation.

Format currency using Indian rupee notation.

### 6. Terms and Conditions
Provide editable fields for:
- Work scope
- Materials and labour
- Payment terms
- Advance and balance payment conditions
- Estimated completion time
- Warranty conditions
- Exclusions and additional charges

Do not promise a warranty period automatically. Let the user specify the actual agreed terms.

### 7. Save and Manage Quotations
Use browser LocalStorage for version 1.

Implement:
- Save draft
- Save changes
- View saved quotations
- Search by quotation number, customer name and location
- Reopen and edit an existing quotation
- Duplicate a quotation with a new unique number
- Delete with confirmation
- Warn about unsaved changes
- Export saved records as JSON
- Import a validated JSON backup

Use unique record IDs and a versioned storage schema. Handle invalid or unavailable storage gracefully. Never silently overwrite unrelated records.

Explain in the UI that data is stored in the current browser and is not cloud-synchronised.

### 8. Tamil and English
Implement a working language toggle for English and Tamil.

Translate all interface labels, buttons, validation messages, status labels and quotation headings. The generated quotation must use the selected language.

Use Tamil-compatible fonts with suitable fallbacks. Verify that Tamil characters render correctly in the browser and exported PDFs.

### 9. Professional A4 Print / PDF
Create a separate printable quotation template.

The printed output must contain:
- HI ONE TECH header
- Quotation number and date
- Customer and project details
- Itemized work table
- Subtotal, discount, tax if applicable, grand total, advance and balance
- Terms and conditions
- Customer and authorized signature areas

Use A4 portrait paper, appropriate margins and readable font sizes.

Use CSS @media print to hide interactive controls, navigation, buttons and form-only elements. Prevent table rows and totals from splitting awkwardly across pages. Support multiple-page quotations with repeated table headers where possible.

Add a Print / Save as PDF button that calls window.print(). Do not use screenshots of the page as PDFs. Do not claim the PDF was saved automatically; allow the user to choose Save as PDF in the browser dialog.

### 10. Validation and Reliability
- Validate required customer and quotation fields.
- Validate quantity, rates, discount and advance.
- Handle empty work items and long descriptions.
- Prevent duplicate saves and stale data overwrites.
- Preserve saved quotations across refreshes.
- Provide clear success/error feedback.
- Ensure calculations update immediately.
- Handle empty, missing and malformed LocalStorage data safely.

## Suggested Components
- AppHeader
- CompanySettings
- QuotationForm
- CustomerDetails
- WorkItemsTable
- QuotationTotals
- TermsEditor
- SavedQuotes
- PrintableQuotation
- LanguageSwitcher

Suggested utility modules:
- calculations.js
- storage.js
- quotationNumber.js
- formatting.js
- translations.js

Keep the architecture simple. Do not introduce Redux, a backend, authentication or a database unless explicitly requested.

## Acceptance Tests
1. Create a quotation with multiple work items and verify every line amount.
2. Verify subtotal, discount, optional tax, grand total, advance and balance.
3. Save a quotation and reload the page; confirm it remains available.
4. Search, reopen, edit, duplicate and delete saved quotations.
5. Confirm duplicate quotations receive new unique numbers.
6. Export and import a JSON backup successfully.
7. Switch between Tamil and English and verify the printable quotation.
8. Print a quotation and verify A4 layout, totals, terms and signature areas.
9. Verify controls do not appear in the printed document.
10. Test long quotations that span multiple pages.
11. Test invalid inputs, empty fields and malformed stored data.
12. Test desktop and mobile layouts.
13. Run the production build and fix all build errors and important console warnings.

## Development Process
1. Inspect the existing repository.
2. Confirm the planned structure and implementation approach.
3. Implement the application in small, testable steps.
4. Test calculations independently.
5. Test LocalStorage persistence and backup/restore.
6. Test print styling and Tamil PDF output.
7. Run the production build and resolve issues.
8. Provide a concise completion report listing implemented features, tests performed, commands to run the project and any known limitations.

Do not stop at a static UI mockup. Implement functional controls, real calculations, persistent storage and a working print workflow. Do not invent company details or sample customer data as real business records.