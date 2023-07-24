import { Router } from "express"
import {
  register,
  login,
  getStatus,
  confirmEmail,
  changePassword,
  sendCodeRecoverPassword,
  verifyCode,
  resetPassword,
} from "../controllers/auth.controller"
import * as groupController from "../controllers/group.controller"
import { getTest } from "../controllers/test.controller"

import {
  getPurchases,
  getOnePruchase,
  createPurchase,
} from "../controllers/purchase.controller"

import { verifyToken } from "../middleware/auth"
import { uploadLogo } from "../controllers/upload.controller"
import rateLimit from "express-rate-limit"
import { createSummary } from "../controllers/summary.controler"

const router = Router()

const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 3,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
  handler: (request, response) =>
    response
      .status(429)
      .send("Demasiadas solicitudes. Por favor, inténtalo de nuevo más tarde."),
})

//Auth
router.post("/register", register)
router.post("/login", login)
router.get("/status", [limiter, verifyToken], getStatus)
router.get("/confirmEmail/:id/:token", confirmEmail)
router.post("/changePassword", changePassword)
router.post("/requestCodeRecPwd", sendCodeRecoverPassword)
router.post("/verifyCode", verifyCode)
router.post("/resetPassword", resetPassword)

router.get(["/", "/test/:name"], (req, res) => {
  let greeting = "<h1>Hello From Node with Express!</h1>"
  let name = req.params["name"]
  if (name) {
    res.send(greeting + "</br>and hello to " + name)
  } else {
    res.send(greeting)
  }
})

// Purchases
router.get("/purchases/:userId", getPurchases)
router.post("/test", getTest)
router.get("/purchase/:id", getOnePruchase)
router.post("/purchase", createPurchase)
// router.post("/purchase", verifyToken, createPurchase)

//Groups
router.get("/groups/:userId", groupController.getGroups)
router.post("/checkGroupName", groupController.checkGroupName)
router.get("/checkExistGroup/:name", groupController.checkExistGroup)
router.post("/group", groupController.createGroup)
router.post("/joinGroup", groupController.joinGroup)

router.post("/addAdmin", groupController.addAdmin)
router.post("/deleteMember", groupController.deleteMember)
router.post("/acceptMember", groupController.acceptMember)
router.post("/rejectMember", groupController.rejectMember)

// Summary
router.post("/summary", createSummary)

// Products
// router.get("/products/:id", getProducts)

// Logo
router.post("/uploadLogo", verifyToken, uploadLogo)

export default router
