import Chat from "../models/Chat.js";

// POST /api/chats
export const createChat = async (req, res, next) => {
  try {
    const bodyCaseId = req.body.caseId;
    const paramCaseId = req.params.caseId;
    const caseId = paramCaseId || bodyCaseId;
    const { userId, message, metadata } = req.body;
    let { role } = req.body;

    if (!caseId || !userId || !message) {
      return res.status(400).json({ error: "caseId, userId and message are required" });
    }

    if (!role) {
      role = "user";
    }

    if (!["user", "assistant"].includes(role)) {
      return res.status(400).json({ error: "role must be 'user' or 'assistant'" });
    }

    const chat = await Chat.create({
      caseId,
      userId,
      role,
      message,
      metadata: metadata || {},
      timestamp: new Date(),
    });

    return res.status(201).json(chat);
  } catch (err) {
    return next(err);
  }
};

// GET /api/chats/:userId
export const getChatsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "userId param is required" });
    }

    const chats = await Chat.find({ userId }).sort({ timestamp: 1 });
    return res.status(200).json(chats);
  } catch (err) {
    return next(err);
  }
};

// GET /api/chats/case/:caseId
export const getChatsByCaseId = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    if (!caseId) {
      return res.status(400).json({ error: "caseId param is required" });
    }

    const chats = await Chat.find({ caseId }).sort({ timestamp: 1 });
    return res.status(200).json(chats);
  } catch (err) {
    return next(err);
  }
};

// DELETE /api/chats/:id
export const deleteChatById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "id param is required" });
    }

    const deleted = await Chat.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Chat not found" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};


