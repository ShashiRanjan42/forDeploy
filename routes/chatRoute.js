import express from "express";
import {
  getChats,
  getChat,
  addChat,
  readChat,
  // chatId
} from "../controller/chatController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getChats);
router.get("/:id", verifyToken, getChat);
router.post("/", verifyToken, addChat);
router.put("/read/:id", verifyToken, readChat);
// router.get("/chatId/:id", verifyToken, chatId);

export default router;
