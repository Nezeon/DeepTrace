import { Router } from "express";
import { createChat, getChatsByUser, deleteChatById, getChatsByCaseId } from "../controllers/chatController.js";

const router = Router();

// POST /api/chats - create a new chat
router.post("/chats", createChat);

// GET /api/chats/:userId - fetch all chats for a user
router.get("/chats/:userId", getChatsByUser);

// DELETE /api/chats/:id - delete a chat by id
router.delete("/chats/:id", deleteChatById);

// CASE-based endpoints
// POST /api/chats/case - create chat (case based) with caseId in body
router.post("/chats/case", createChat);

// POST /api/chats/case/:caseId - create chat (case based) with caseId in param
router.post("/chats/case/:caseId", createChat);

// GET /api/chats/case/:caseId - fetch chats by caseId
router.get("/chats/case/:caseId", getChatsByCaseId);

// Aliases
router.post("/chat", createChat);
router.get("/chat/:caseId", getChatsByCaseId);

export default router;


