import { Router } from "express"
import { register, login, getStatus } from "../controllers/auth.controller.js"
import { getGroups, createGroup } from "../controllers/group.controller.js"
import { getProducts } from "../controllers/product.controller.js"

import {
  getPurchases,
  getOnePruchase,
  createPurchase,
} from "../controllers/purchase.controller.js"

import { verifyToken } from "../middleware/auth.js"

const router = Router()

//Auth
router.post("/register", register)
router.post("/login", login)
router.get("/status", getStatus)

router.get(["/", "/test/:name"], (req, res) => {
  let greeting = "<h1>Hello From Node on Fly!</h1>"
  let name = req.params["name"]
  if (name) {
    res.send(greeting + "</br>and hello to " + name)
  } else {
    res.send(greeting)
  }
})

// Purchases
router.get("/purchases", getPurchases)
router.get("/purchase/:id", getOnePruchase)
router.post("/purchase", createPurchase)
// router.post("/purchase", verifyToken, createPurchase)

//Groups
router.get("/groups", getGroups)
router.post("/group", createGroup)

// Products
router.get("/products/:id", getProducts)

export default router
