import { prisma } from "../server/prisma.js"

export const createGroup = async (req, res) => {
  const { name, users } = req.body

  console.log(name, users)

  const newGroup = await prisma.group.create({
    data: {
      name,
      Users: { connect: users },
    },
  })
  res.json(newGroup)
}

export const getGroups = async (req, res) => {
  const groups = await prisma.group.findMany({ include: { Users: true } })

  res.status(200).json(groups)
}

export const checkGroupName = async (req, res) => {
  const { name } = req.body
  console.log("name", name)
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
