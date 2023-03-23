// import prisma from "../server/prisma"
import { prisma } from "../server/prisma.js"
// import { PrismaClient } from "@prisma/client"

export const getPurchases = async (req, res) => {
  const purchases = await prisma.purchase.findMany()
  // console.log(purchases)
  res.status(200).json(purchases)
}

export const createPurchase = async (req, res) => {
  console.log(req.body)
  const { dateBuy, product, quantity, price, shared, userId } = req.body
  const purchases = await prisma.purchase.create({
    data: {
      // dateBuy,
      product,
      quantity,
      price,
      total: calculateTotal(price, quantity, shared),
      shared: shared,
      User: { connect: { id: +userId } },
    },
  })
  // console.log(purchases)
  res.json(purchases)
}

const calculateTotal = (price, quantity, shared) => {
  let total = shared ? (price * quantity) / 2 : price * quantity
  return total
}
