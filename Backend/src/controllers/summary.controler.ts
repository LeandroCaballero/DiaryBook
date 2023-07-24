import { Request, Response } from "express"
import prisma from "../server/prisma"

// export const getSummaries = () => {}

export const createSummary = async (req: Request, res: Response) => {
  const { dateStart, dateEnd, groupId, transactions } = req.body

  //   console.log(req.body)

  try {
    const newSummary = await prisma.summary.create({
      data: {
        dateStart,
        dateEnd,
        Group: { connect: { id: groupId } },
        Transactions: {
          createMany: {
            data: [
              ...transactions.map(
                (transaction: {
                  buyerId: string
                  debtorId: string
                  amount: number
                }) => ({
                  buyerId: transaction.buyerId,
                  debtorId: transaction.debtorId,
                  amount: transaction.amount,
                })
              ),
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
