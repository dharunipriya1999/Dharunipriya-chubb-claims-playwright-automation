# Test Cases Inventory: Playwright E2E Automation Suite

This document outlines the complete list of test cases covered in the automated Playwright TypeScript test suite for the Chubb APAC Claims Management Application. The test suite runs across multiple browser engines (**Chromium, Firefox, WebKit**).

---

## 1. Authentication Flow (`tests/auth.spec.ts`)

| Test ID | Test Title | Description & Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| **AUTH-01** | Admin can log in successfully | Navigates to the login page, fills in admin credentials (`admin@demo.com`), submits the form, and verifies successful redirection to the admin dashboard (`/admin`). | **Passing (All Browsers)** |
| **AUTH-02** | Claimant can log in successfully | Navigates to the login page, fills in claimant credentials (`claimant@demo.com`), submits the form, and verifies successful redirection to the claims dashboard (`/claims`). | **Passing (All Browsers)** |

---

## 2. Claims Submission Flow (`tests/claims.spec.ts`)

| Test ID | Test Title | Description & Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| **CLM-01** | Validates Step 1 textbox limits and displays error messages | Logs in as a claimant, opens the "Submit New Claim" wizard, inputs invalid boundary data (e.g., location with $<5$ characters, claim amount exceeding $\$1,000,000$), and asserts that appropriate validation error messages appear. | **Passing (All Browsers)** |
| **CLM-02** | Completes full multi-step claim submission and submits successfully | Logs in as a claimant, initiates a new claim, completes **Step 1 (Incident Details)** with valid data, proceeds to **Step 2 (Supporting Details)** and fills out the description, proceeds to **Step 3 (Review & Submit)**, submits the final claim, and verifies successful redirection back to the claims dashboard (`/claims`). | **Passing (All Browsers)** |

---

## 3. Test Coverage Summary
* **Total Test Cases:** 4 core test definitions (executed across 3 browser projects = 12 total test permutations).
* **Execution Mode:** Serial sequential worker execution (`--workers=1`) to prevent session state collisions.
* **Reporting:** Integrated HTML reporting (`./test-results/html-report`) with automatic screenshot capture on failure (`screenshot: 'only-on-failure'`).