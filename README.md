# Local Todos

**Local Todos** is a privacy-focused todo manager built with **TypeScript**, **Zustand**, **IndexedDB**, and **Web Crypto**.  
It was created as a learning project to explore state management, encryption, and local storage in modern web apps.

---

## Features

- **Local & Encrypted Storage**  
  All todos are stored directly in the browser using IndexedDB and encrypted with the Web Crypto API.  
  Your data never leaves your device.

- **User Registration & Login**  
  - New users can register instantly.  
  - On first save, they are prompted to create a passphrase to secure their data.  
  - Existing users can log in, and won't be prompted to enter the passphrase on save again.

- **Projects & Organization**  
  - Create multiple **Projects** to separate areas of work or life.  
  - Inside each project, add **Todo Groups** or todos for structured task management.

- **Fast & Offline-First**  
  Everything works offline — no server, no syncing, no external dependencies.  
  Perfect for quick, private task management.

---

## Tech Stack

- **TypeScript**: for type-safe, scalable code  
- **Zustand**: lightweight state management  
- **IndexedDB**: persistent local storage in the browser  
- **Web Crypto API**: encryption for data security  

---

## Getting Started

### Prerequisites
- Node.js (>= 16)
- npm or yarn

### Installation
```bash
  git clone https://github.com/yourusername/local-todos.git
  cd local-todos
  npm install
```

### Run locally
```bash
  npm run dev
```

This will start the app in development mode.
Open http://localhost:5173

---

## Learning Goals

This project was built to explore:

- **TypeScript** for type-safe frontend development
- **Zustand** for minimal and intuitive state management
- **IndexedDB** for client-side persistence
- **Web Crypto API** for encrypting sensitive data