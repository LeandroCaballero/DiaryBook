import { Router } from "express"
import { register, login, getStatus } from "../controllers/auth.controller.js"
import { getGroups, createGroup } from "../controllers/group.controller.js"

import {
  getPurchases,
  createPurchase,
} from "../controllers/purchase.controller.js"

import { verifyToken } from "../middleware/auth.js"

const router = Router()

//Auth
router.post("/register", register)
router.post("/login", login)
router.get("/status", getStatus)

// Purchases
router.get("/purchase", getPurchases)
// router.post("/purchase", verifyToken, createPurchase)
router.post("/purchase", createPurchase)

//Groups
router.get("/groups", getGroups)
router.post("/group", createGroup)

export default router
