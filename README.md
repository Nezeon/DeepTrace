# ForensiQ Backend (Express + MongoDB)

This repository contains a Vite + Express development setup for ForensiQ with a standalone backend entry `server.js` that exposes chat APIs.

## Quick start

- Prerequisites: Node 18+, PNPM, MongoDB running locally or an Atlas URI.
- Install dependencies:
  - `pnpm install`
- Start frontend (Vite + integrated Express for demo endpoints):
  - `pnpm dev` → http://localhost:8080
- Start backend (standalone API with MongoDB):
  - Local defaults: `pnpm run dev:server:local`
    - Uses `MONGODB_URI=mongodb://localhost:27017/forensiq` and `PORT=5000`
  - With .env:
    - Copy `docs/env.example` to `.env` and set values
    - `pnpm run dev:server`
  - Health: `GET http://localhost:5000/api/health`

## Environment variables

See `docs/env.example` for defaults:

- `MONGODB_URI` → e.g. `mongodb://localhost:27017/forensiq`
- `MONGODB_DB` (optional) → database name if not in URI
- `PORT` → default `5000`

## Chat API

Routes are mounted under `/api` by `server.js`.

- Create chat (case-based)
  - `POST /api/chats/case`
  - Alias: `POST /api/chat`
  - Body: `{ caseId: string, userId: string, message: string, metadata?: object }`
- Get chats by caseId
  - `GET /api/chats/case/:caseId`
  - Alias: `GET /api/chat/:caseId`
- Get chats by userId
  - `GET /api/chats/:userId`
- Delete chat by id
  - `DELETE /api/chats/:id`

## Files

- `server.js` → entry point, mounts `/api` routes, health, CORS, morgan, DB connect
- `routes/chatRoutes.js` → route definitions
- `controllers/chatController.js` → business logic
- `models/Chat.js` → Mongoose schema with `caseId`, `userId`, `message`, `timestamp`, `metadata`
- `config/db.js` → Mongo connection

## Testing (PowerShell examples)

```powershell
$case = "demo-case-1"
$user = "demo-user-1"
$body = @{ caseId=$case; userId=$user; message='hello'; metadata=@{ source='demo' } } | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/chats/case -ContentType 'application/json' -Body $body
Invoke-RestMethod -Uri http://localhost:5000/api/chats/case/$case
Invoke-RestMethod -Uri http://localhost:5000/api/chats/$user
# Replace <id>
Invoke-RestMethod -Method Delete -Uri http://localhost:5000/api/chats/<id>
```
