import { Router } from "express"
import {
  register,
  login,
  getStatus,
  confirmEmail,
} from "../controllers/auth.controller"
import {
  getGroups,
  createGroup,
  checkGroupName,
  checkExistGroup,
} from "../controllers/group.controller"
import { getProducts } from "../controllers/product.controller"
import { getTest } from "../controllers/test.controller"

import {
  getPurchases,
  getOnePruchase,
  createPurchase,
} from "../controllers/purchase.controller"

import { verifyToken } from "../middleware/auth"

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
// router.post("/test", getTest)
router.get("/purchase/:id", getOnePruchase)
router.post("/purchase", createPurchase)
// router.post("/purchase", verifyToken, createPurchase)

//Groups
router.get("/groups/:userId", getGroups)
router.post("/checkGroupName", checkGroupName)
router.get("/checkExistGroup/:id", checkExistGroup)

router.post("/group", createGroup)

// Products
// router.get("/products/:id", getProducts)

export default router
