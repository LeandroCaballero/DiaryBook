import { Router } from "express"
import {
  register,
  login,
  getStatus,
  confirmEmail,
} from "../controllers/auth.controller"
import * as groupController from "../controllers/group.controller"
import { getProducts } from "../controllers/product.controller"
import { getTest } from "../controllers/test.controller"

import {
  getPurchases,
  getOnePruchase,
  createPurchase,
} from "../controllers/purchase.controller"

import { verifyToken } from "../middleware/auth"
import { uploadLogo } from "../controllers/upload.controller"

const router = Router()

//Auth
router.post("/register", register)
router.post("/login", login)
router.get("/status", verifyToken, getStatus)
router.get("/confirmEmail/:id/:token", confirmEmail)

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
router.get("/purchases", getPurchases)
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

// Products
// router.get("/products/:id", getProducts)

// Logo
router.post("/uploadLogo", verifyToken, uploadLogo)

export default router
