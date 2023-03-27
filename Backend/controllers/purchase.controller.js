import { prisma } from "../server/prisma.js"

export const getPurchases = async (req, res) => {
  const purchases = await prisma.purchase.findMany({
    include: { PurchaseItems: true },
  })

  res.status(200).json(purchases)
}

export const createPurchase = async (req, res) => {
  console.log(req.body)
  const { dateBuy, groupId, buyerId, purchaseItems } = req.body

  const newPurchaseItems = await Promise.all(
    purchaseItems.map(async (item) => {
      const newPurchaseItem = await prisma.purchaseItem.create({
        data: {
          price: item.price,
          shared: item.shared,
          quantity: item.quantity,
          total: item.shared
            ? (item.price * item.quantity) / 2
            : item.price * item.quantity,
          Product: {
            connectOrCreate: {
              where: { id: +item.product.id },
              create: { name: item.product.name },
            },
          },
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
