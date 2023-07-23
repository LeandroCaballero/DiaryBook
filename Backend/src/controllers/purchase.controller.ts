import { Request, Response } from "express"
import prisma from "../server/prisma"
import { User } from "@prisma/client"

export const getPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: { PurchaseItems: { include: { forUsers: true } } },
    })

    res.status(200).json(purchases)
  } catch (error) {
    console.log("ERROR", error)
  }
}

export const createPurchase = async (req: Request, res: Response) => {
  console.log(req.body)
  const { name, dateBuy, groupId, buyerId, purchaseItems } = req.body

  try {
    const newPurchase = await prisma.purchase.create({
      data: {
        name,
        dateBuy,
        Group: { connect: { id: groupId } },
        Buyer: { connect: { id: buyerId } },
        PurchaseItems: {
          createMany: {
            data: [
              ...purchaseItems.map((purchaseItem: any) => ({
                price: +purchaseItem.price,
                quantity: +purchaseItem.quantity,
                total: +purchaseItem.price * +purchaseItem.quantity,
                productName: purchaseItem.productName,
              })),
            ],
          },
        },
      },
      include: { PurchaseItems: true },
    })

    const updatePurchaseItems = newPurchase.PurchaseItems.map(
      async (purchaseItem, index) => {
        await prisma.purchaseItem.update({
          where: { id: purchaseItem.id },
          data: {
            forUsers: {
              connect: [
                ...purchaseItems[index].forUsers.map((user: User) => ({
                  id: user.id,
                })),
              ],
            },
          },
        })
      }
    )

    // await prisma.$transaction(
    //   async (tx) => {
    //     // 1. Create pruchase with items
    //     const newPurchase = await tx.purchase.create({
    //       data: {
    //         name,
    //         dateBuy,
    //         Group: { connect: { id: groupId } },
    //         Buyer: { connect: { id: buyerId } },
    //         PurchaseItems: {
    //           createMany: {
    //             data: [
    //               ...purchaseItems.map((purchaseItem: any) => ({
    //                 price: +purchaseItem.price,
    //                 quantity: +purchaseItem.quantity,
    //                 total: +purchaseItem.price * +purchaseItem.quantity,
    //                 productName: purchaseItem.productName,
    //               })),
    //             ],
    //           },
    //         },
    //       },
    //       include: { PurchaseItems: true },
    //     })

    //     // 2. Update forUsers in Items
    //     newPurchase.PurchaseItems.map(async (purchaseItem, index) => {
    //       await tx.purchaseItem.update({
    //         where: { id: purchaseItem.id },
    //         data: {
    //           forUsers: {
    //             connect: [
    //               ...purchaseItems[index].forUsers.map((user: User) => ({
    //                 id: user.id,
    //               })),
    //             ],
    //           },
    //         },
    //       })
    //     })
    //   },
    //   { maxWait: 7000, timeout: 7000 }
    // )

    // [
    //   ...newPurchase.PurchaseItems.map((purchaseItem, index) => {
    //     return prisma.purchaseItem.update({
    //       where: { id: purchaseItem.id },
    //       data: {
    //         forUsers: {
    //           connect: [
    //             ...purchaseItems[index].forUsers.map((user: User) => ({
    //               id: user.id,
    //             })),
    //           ],
    //         },
    //       },
    //     })
    //   }),
    // ]
    // (async (tx) => {
    //   // 1. Decrement amount from the sender.
    //   const sender = await tx.account.update({
    //     data: {
    //       balance: {
    //         decrement: amount,
    //       },
    //     },
    //     where: {
    //       email: from,
    //     },
    //   })

    //   // 2. Verify that the sender's balance didn't go below zero.
    //   if (sender.balance < 0) {
    //     throw new Error(`${from} doesn't have enough to send ${amount}`)
    //   }

    //   // 3. Increment the recipient's balance by amount
    //   const recipient = await tx.account.update({
    //     data: {
    //       balance: {
    //         increment: amount,
    //       },
    //     },
    //     where: {
    //       email: to,
    //     },
    //   })

    //   return recipient
    // })

    return res.status(200).json({ message: "Compra registrada con éxito!" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Hubo un error, intente más tarde" })
  }

  // const connectPurchasesItemsForUsers = newPurchase.PurchaseItems.map((purchaseItem) => )
  // const newPurchaseItems = await prisma.purchaseItem.createMany({
  //   data: [
  //     ...purchaseItems.map((purchaseItem: any) => ({
  //       price: +purchaseItem.price,
  //       quantity: +purchaseItem.quantity,
  //       total: +purchaseItem.price * +purchaseItem.quantity,
  //       productName: purchaseItem.productName,
  //     })),
  //   ],
  // })

  // const updatePurchaseItems = purchaseItems.map(
  //   async (purchaseItem: any, index: number) => {
  //     await prisma.purchaseItem.update({
  //       where: { id: newPurchaseItems[index].id },
  //       data: {
  //         forUsers: {
  //           connect: [
  //             ...purchaseItem.forUsers.map((user: any) => ({
  //               id: user.user.id,
  //             })),
  //           ],
  //         },
  //       },
  //     })
  //   }
  // )
  // console.log(updatePurchaseItems)

  // PurchaseItems: {
  //       connect: [...newPurchaseItems.map((e) => ({ id: e.id }))],
  //     },

  // const newPurchaseItems = await Promise.all(
  //   purchaseItems.map(async (item: any) => {
  //     const newPurchaseItem = await prisma.purchaseItem.create({
  //       data: {
  //         price: item.price,
  //         forUsers: item.forUsers,
  //         quantity: item.quantity,
  //         total: item.shared
  //           ? (item.price * item.quantity) / 2
  //           : item.price * item.quantity,
  //         productName: item.productName,
  //         // Product: {
  //         //   connectOrCreate: {
  //         //     where: { id: +item.product.id },
  //         //     create: { name: item.product.name },
  //         //   },
  //         // },
  //       },
  //     })

  //     return newPurchaseItem
  //   })
  // )

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

  // const newPurchase = await prisma.purchase.create({
  //   data: {
  //     dateBuy,
  //     Group: { connect: { id: groupId } },
  //     Buyer: { connect: { id: buyerId } },
  //     PurchaseItems: {
  //       connect: [...newPurchaseItems.map((e) => ({ id: e.id }))],
  //     },
  //   },
  // })

  // res.json(newPurchase)
}

export const getOnePruchase = async (req: Request, res: Response) => {
  const purchase = await prisma.purchase.findFirst({
    where: { id: req.params.id },
    include: { PurchaseItems: true },
  })

  res.status(200).json(purchase)
}
