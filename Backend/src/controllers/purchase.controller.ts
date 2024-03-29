import { Request, Response } from "express"
import prisma from "../server/prisma"

export const getPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: { PurchaseItems: true },
    })

    res.status(200).json(purchases)
  } catch (error) {
    console.log("ERROR", error)
  }
}

export const createPurchase = async (req: Request, res: Response) => {
  console.log(req.body)
  const { dateBuy, groupId, buyerId, purchaseItems } = req.body

  const newPurchaseItems = await Promise.all(
    purchaseItems.map(async (item: any) => {
      const newPurchaseItem = await prisma.purchaseItem.create({
        data: {
          price: item.price,
          shared: item.shared,
          quantity: item.quantity,
          total: item.shared
            ? (item.price * item.quantity) / 2
            : item.price * item.quantity,
          productName: item.productName,
          // Product: {
          //   connectOrCreate: {
          //     where: { id: +item.product.id },
          //     create: { name: item.product.name },
          //   },
          // },
        },
      })

      return newPurchaseItem
    })
  )

  // const newPurchaseItems = await prisma.purchaseItem.createMany({
  //   data: [
  //     ...purchaseItems.map((item) => ({
  //       price: item.price,
  //       shared: item.shared,
  //       quantity: item.quantity,
  //       total: item.shared
  //         ? (item.price * item.quantity) / 2
  //         : item.price * item.quantity,
  //       Product: {
  //         connectOrCreate: {
  //           where: { id: item.product.id },
  //           create: { name: item.product.name },
  //         },
  //       },
  //     })),
  //   ],
  // })

  const newPurchase = await prisma.purchase.create({
    data: {
      dateBuy,
      Group: { connect: { id: +groupId } },
      Buyer: { connect: { id: +buyerId } },
      PurchaseItems: {
        connect: [...newPurchaseItems.map((e) => ({ id: +e.id }))],
      },
    },
  })

  res.json(newPurchase)
}

export const getOnePruchase = async (req: Request, res: Response) => {
  const purchase = await prisma.purchase.findFirst({
    where: { id: +req.params.id },
    include: { PurchaseItems: true },
  })

  res.status(200).json(purchase)
}
