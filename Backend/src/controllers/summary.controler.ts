import { Request, Response } from "express"
import prisma from "../server/prisma"
import { User } from "@prisma/client"

type NewTransaction = {
  buyerId: string
  debtorId: string
  amount: number
}[]

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

  const initialValueFinal: NewTransaction = []

  let transactionsFinish: NewTransaction = []
  if (findGroup) {
    transactionsFinish = findGroup.Purchases.reduce((acc, curr) => {
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
        let { amount, buyerId } = acc[findOldIndex]
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
    }, initialValue).reduce((acc, curr) => {
      let newTransaction = curr.debtors.map((id) => ({
        buyerId: curr.buyerId,
        amount: curr.amount / curr.debtors.length,
        debtorId: id,
      }))
      return [...acc, ...newTransaction]
    }, initialValueFinal)
  }

  // console.log(transactionsFinish)
  // res.status(200).json(findGroup)

  try {
    const newSummary = await prisma.summary.create({
      data: {
        dateStart,
        dateEnd,
        Group: { connect: { id: groupId } },
        Transactions: {
          createMany: {
            data: [
              ...transactionsFinish.map((transaction) => ({
                buyerId: transaction.buyerId,
                debtorId: transaction.debtorId,
                amount: transaction.amount,
              })),
            ],
          },
        },
      },
    })
    res.status(200).json(newSummary)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error intente más tarde" })
  }
}

export const confirmTransaction = async (req: Request, res: Response) => {
  const transactionId = req.params.id

  try {
    await prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        status: "Paid",
      },
    })
  } catch (error) {
    return res.status(500).json({ message: "Error al confirmar transacción" })
  }

  res.status(200).json({ message: "Transacción confirmada con éxito!" })
}
