<sub>Created: 2025/08/26 09:44:39
<br/>Last modified: 2025/08/27 15:10:02
</sub>

# My Bill Tracker <!-- omit from toc -->

A personal finance tracker built with **React + TypeScript**.  
The goal of this project is to create a clean, modern, and customizable way to manage recurring bills, forecast upcoming expenses, and stay on top of financial commitments.

This app is designed not only as a practical tool, but also as a showcase of my full-stack development skills, with a focus on:
- **TypeScript DTOs** for strong typing and reliability  
- **Reusable utilities** to handle core financial logic  
- **Clear separation of concerns** between data models, utilities, and UI components  
- A visually intuitive interface that makes bills, due dates, and forecasts easy to digest at a glance




[Features (Planned \& In Progress)](#features-planned--in-progress) |
[Tech Stack](#tech-stack) |
[Why This Project?](#why-this-project) |
[Getting Started](#getting-started)


## Features (Planned & In Progress)

- [x] 📌 Add, edit, and delete bills  
- [x] 📆 See upcoming due dates on a timeline view  
- [ ] ☁️ Add PWA functionality to be able to install on mobile.
- [ ] 📆 Add recurring bills with options for monthly, weekly, or specific dates recursion
- [ ] 📌 Add categorization tags/colors (rent, electric, etc)
- [ ] 💰 Track variances between expected vs. actual amounts  
- [ ] 📊 Forecast future expenses across months  
- [ ] 🔍 Filter and search for specific bills  
- [ ] ☁️ (Future) Sync with a backend for persistent data storage  
- [ ] 🔒 (Future) Add authentication and authorization
- [ ] ⚡ (Future) Implement APIs to pull and display amounts owed dynamically
- [ ] 🏦 (Future) Integrate with a bank account in order to show the current balance
- [ ] 💸 (Future) **Integrate with bank and biller APIs in order to make payments,** ***directly*** **from the app.**

---

## Tech Stack

- **Frontend**: React + TypeScript  
- **Styling**: TailwindCSS (planned)  
- **Build Tooling**: Create React App (TypeScript template)  
- **State Management**: (Planned – either Context API or Redux, depending on complexity)  
- **Backend**: Placeholder for now (likely Node.js + Express + PostgreSQL or SQL Server in the future)

---

## Why This Project?

Managing recurring bills often means juggling spreadsheets, reminders, and mental math.  
This tracker aims to provide a single, elegant interface for **clarity, control, and confidence** in personal finances.

It’s also a way to demonstrate:
- Clean coding practices in TypeScript  
- Scalable project structure  
- UI/UX thought process  
- Long-term vision for full-stack development  

---

## Getting Started

Clone the repo and run locally:

```bash
git clone https://github.com/jakehayes12798/my-bill-tracker.git
cd my-bill-tracker
npm install
npm start
```

`src\config.ts` is the centralized source of truth regarding project identity and versioning. 

Shoutout to SonarQube for constantly telling me where my code sucks so I can improve, I love you guys <3 