import { Request, Response } from "express"
import prisma from "../server/prisma"

export const createGroup = async (req: Request, res: Response) => {
  const { name, user } = req.body

  const newGroup = await prisma.group.create({
    data: {
      name,
      Users: { connect: { id: user } },
      Admins: { connect: { id: user } },
    },
  })
  res.status(200).json(newGroup)
}

export const getGroups = async (req: Request, res: Response) => {
  const { userId } = req.params

  const groups = await prisma.group.findMany({
    where: { Users: { some: { id: +userId } } },
    include: { Users: true, Admins: true, Purchases: true },
  })

  res.status(200).json(groups)
}

export const checkGroupName = async (req: Request, res: Response) => {
  const { name } = req.body
  // console.log("name", name)
  const groups = await prisma.group.findFirst({ where: { name: name } })

  const response = groups
    ? {
        text: "Ya existe un grupo con el nombre ingresado",
        color: "red-500",
        available: false,
      }
    : {
        text: "El nombre esta disponible",
        color: "green-500",
        available: true,
      }

  res.status(200).json(response)
}

export const checkExistGroup = async (req: Request, res: Response) => {
  const { name } = req.params

  const group = await prisma.group.findFirst({ where: { name: name } })

  res.status(200).json(group)
}
