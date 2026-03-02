import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  registerUser,
  loginUser,
  subscribeUser,
} from "../controllers/userController.js";

const router = express.Router();

// REGISTER

router.post("/register", registerUser);

// LOGIN

router.post("/login", loginUser);

// SUBSCRIBE

router.put(
  "/subscribe/:id",

  authMiddleware,

  subscribeUser,
);

export default router;
