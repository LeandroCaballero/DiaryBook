import { Request, Response } from "express"
import prisma from "../server/prisma"

export const createGroup = async (req: Request, res: Response) => {
  const { name, user } = req.body

  const newGroup = await prisma.group.create({
    data: {
      name,
      Admins: { connect: { id: user } },
    },
  })
  res.status(200).json(newGroup)
}

export const getGroups = async (req: Request, res: Response) => {
  const { userId } = req.params

  const groups = await prisma.group.findMany({
    where: {
      OR: [
        { Users: { some: { id: userId } } },
        { Admins: { some: { id: userId } } },
      ],
    },
    include: {
      Users: true,
      Admins: true,
      Purchases: {
        include: { PurchaseItems: { include: { forUsers: true } } },
      },
      RequestUsers: true,
    },
  })

  res.status(200).json(groups)
}

export const checkGroupName = async (req: Request, res: Response) => {
  const { name } = req.body
  // console.log("name", name)
  const group = await prisma.group.findFirst({ where: { name: name } })

  if (group) {
    return res.status(409).json({
      text: "Ya existe un grupo con el nombre ingresado",
      available: false,
      name,
    })
  }

  return res.status(200).json({
    text: "El nombre esta disponible",
    available: true,
    name,
  })
}

export const checkExistGroup = async (req: Request, res: Response) => {
  const { name } = req.params
  const group = await prisma.group.findFirst({ where: { name: name } })

  if (group) {
    return res.status(200).json({
      text: "Nombre correcto!",
      exist: true,
      name: name,
      group,
    })
  }

  return res.status(409).json({
    text: "No existe un grupo con el nombre ingresado!",
    exist: false,
    name,
  })
}

export const joinGroup = async (req: Request, res: Response) => {
  const { groupId, userId } = req.body
  console.log(groupId, userId)

  const updateGroup = await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      RequestUsers: { connect: { id: userId } },
    },
  })

  if (updateGroup) {
    return res.status(200).json({
      message: "Solicitud enviada",
    })
  }

  return res.status(500).json({
    message: "Hubo un error al enviar la solicitud",
  })
}

export const addAdmin = async (req: Request, res: Response) => {
  const { groupId, userId } = req.body

  const updateGroup = await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      Admins: { connect: { id: userId } },
      Users: { disconnect: { id: userId } },
    },
    include: {
      Admins: true,
    },
  })

  if (updateGroup) {
    return res.status(200).json({
      message: `Se agregó a ${
        updateGroup.Admins.find((el) => el.id == userId)?.name
      } como administrador!`,
    })
  }

  return res.status(500).json({
    message: "Hubo un error al agregar administrador!",
  })
}

export const deleteMember = async (req: Request, res: Response) => {
  const { groupId, userId } = req.body

  const updateGroup = await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      Users: { disconnect: { id: userId } },
    },
  })

  if (updateGroup) {
    return res.status(200).json({
      message: "Se eliminó al usuario del grupo!",
    })
  }

  return res.status(500).json({
    message: "Hubo un error al eliminar al usuario!",
  })
}

export const acceptMember = async (req: Request, res: Response) => {
  const { groupId, userId } = req.body

  const updateGroup = await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      RequestUsers: { disconnect: { id: userId } },
      Users: { connect: { id: userId } },
    },
    include: { Users: true },
  })

  if (updateGroup) {
    return res.status(200).json({
      message: `Se aceptó a ${
        updateGroup.Users.find((el) => el.id == userId)?.name
      } en el grupo!`,
    })
  }

  return res.status(500).json({
    message: "Hubo un error al aceptar la solicitud!",
  })
}

export const rejectMember = async (req: Request, res: Response) => {
  const { groupId, userId } = req.body

  const updateGroup = await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      RequestUsers: { disconnect: { id: userId } },
    },
  })

  if (updateGroup) {
    return res.status(200).json({
      message: "Se ha rechazado al usuario correctamente!",
    })
  }

  return res.status(500).json({
    message: "Hubo un error al rechazar la solicitud!",
  })
}
