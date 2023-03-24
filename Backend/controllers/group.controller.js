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
