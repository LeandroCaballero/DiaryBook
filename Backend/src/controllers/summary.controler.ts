import { Request, Response } from "express"
import prisma from "../server/prisma"

// export const getSummaries = () => {}

export const createSummary = async (req: Request, res: Response) => {
  const { dateStart, dateEnd, groupId, userId, transactions } = req.body

  console.log(req.body)

  const findGroup = await prisma.group.findFirst({
    where: {
      id: groupId,
    },
    include: {
      Purchases: {
        where: {
          dateBuy: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
        include: {
          PurchaseItems: { include: { forUsers: true } },
        },
      },
    },
  })

  const initialValue: {
    buyerId: string
    debtorId: string
    amount: number
  }[] = []

  const transactionsFinish = findGroup?.Purchases.reduce((acc, curr) => {
    for (const purchaseItem of curr.PurchaseItems) {
      // const find = purchaseItem.forUsers.some((user) =>
      //   acc.find((el) => el.buyerId == user.id)
      // )
    }
    // curr.PurchaseItems.map((purchaseItem) => {})
    return [...acc]
  }, initialValue)

  console.log(findGroup)
  res.status(200).json(findGroup)

  // try {
  //   const newSummary = await prisma.summary.create({
  //     data: {
  //       dateStart,
  //       dateEnd,
  //       Group: { connect: { id: groupId } },
  //       Transactions: {
  //         createMany: {
  //           data: [
  //             ...transactions.map(
  //               (transaction: {
  //                 buyerId: string
  //                 debtorId: string
  //                 amount: number
  //               }) => ({
  //                 buyerId: transaction.buyerId,
  //                 debtorId: transaction.debtorId,
  //                 amount: transaction.amount,
  //               })
  //             ),
  //           ],
  //         },
  //       },
  //     },
  //   })
  //   res.status(200).json(newSummary)
  // } catch (error) {
  //   console.log(error)
  //   res.status(500).json({ message: "Error intente más tarde" })
  // }
}
