# To Do

- [x] Move Edit and Record Payment modals to their own component classes

- [ ] Move secrets from .env.local to somewhere server-side (Vercel?)

# Changelog

## 2025-08-27

- [x] added Edit and Record Payment modals

## 2025-08-28

- [x] added new app icon
- [x] added progressive web application scaffolding

## 0.2.0 (2025-09-02)

- [x] added Airtable API integration for READ ONLY (still need to add the ability to edit, add, and delete bills via Whisker)

## 0.3.0 (2025-09-02)

- [x] added Airtable API integration for all CRUD operations (I think)

## 0.3.1 (2025-09-03)

- [x] fixed some CSS issues
- [x] add the AddBillDialog option to replace the webform
- [x] made the billSchema more robust

## 0.3.2 (2025-09-05)

- [x] sorted bills by unpaid within 60 days, paid within 60 days, unpaid after
- [x] added date dropdown to parameterize the search
- [x] enabled collapsing of bills in order to later allow for recurring bills