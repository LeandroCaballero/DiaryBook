import { Router } from "express"
import { register, login, getStatus } from "../controllers/auth.controller.js"
import {
  getPurchases,
  createPurchase,
} from "../controllers/purchase.controller.js"

import { verifyToken } from "../middleware/auth.js"

const router = Router()

//Auth
router.post("/register", register)
router.post("/login", login)
router.get("/status", verifyToken, getStatus)

// Purchases
router.get("/purchase", verifyToken, getPurchases)
router.post("/purchase", verifyToken, createPurchase)

export default router
