# Chat App Frontend

This is the SvelteKit (TypeScript) frontend for the Chat App.

---

## Prerequisites
- Node.js (v18+ recommended)

---

## Development

```
cd chat-app-frontend
npm install
npm run dev
```
Frontend runs on [http://localhost:5173](http://localhost:5173)

### Proxy Setup
API requests to `/api` are proxied to the backend (Spring Boot) at `http://localhost:8080`.
This is set up in `vite.config.ts`:
```ts
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```

---

## Production Build

```
npm run build
```
Copy the build output to the backend's `src/main/resources/static` directory to serve with Spring Boot.

---

## Features
- Modern, responsive UI
- Real-time chat (WebSocket)
- Profile with custom avatar upload

---

See the main project README for full-stack setup and features.
