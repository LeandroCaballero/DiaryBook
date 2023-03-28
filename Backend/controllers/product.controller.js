import { prisma } from "../server/prisma.js"

export const getProducts = async (req, res) => {
  const products = await prisma.product.findMany()

  res.status(200).json(products)
}
