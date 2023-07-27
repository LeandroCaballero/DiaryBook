import { Request, Response } from "express"
import prisma from "../server/prisma"
import { User } from "@prisma/client"

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
    debtors: string[]
    amount: number
  }[] = []

  const transactionsFinish = findGroup?.Purchases.reduce((acc, curr) => {
    let findOldIndex = acc.findIndex((el) => el.buyerId == curr.buyerId)
    let users: string[] = findOldIndex > -1 ? acc[findOldIndex].debtors : []
    let newAmount = 0

    for (const purchaseItem of curr.PurchaseItems) {
      for (const user of purchaseItem.forUsers) {
        let findOldUser = users.find((us) => us == user.id)
        if (user.id != curr.buyerId) {
          if (!findOldUser) {
            users.push(user.id)
          }
          newAmount += purchaseItem.total
        }
      }
    }

    if (findOldIndex > -1) {
      let { amount, buyerId, debtors } = acc[findOldIndex]
      acc[findOldIndex] = {
        buyerId,
        amount: amount + newAmount,
        debtors: users,
      }
    } else {
      acc.push({
        amount: newAmount,
        buyerId: curr.buyerId,
        debtors: users,
      })
    }

    return [...acc]
  }, initialValue)

  console.log(transactionsFinish)
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
