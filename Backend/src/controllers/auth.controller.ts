import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../server/prisma"
import sgMail from "@sendgrid/mail"
import crypto from "crypto"
import { Request, Response } from "express"

// SENDGRID_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  // console.log("Entra en register", req.body)

  const oldUser = await prisma.user.findFirst({ where: { email } })

  if (oldUser) {
    return res
      .status(409)
      .json({ message: "El email ya se encuentra registrado" })
  }

  let encryptedPassword = await bcrypt.hash(password, 10)

  const bytes = crypto.randomBytes(12)
  const token = bytes.toString("hex")

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: encryptedPassword,
      tokenEmail: token,
    },
  })

  if (user) {
    const msg = {
      to: email,
      from: "diarybook.arg@gmail.com",
      templateId: "d-63875ba1c11a4fecb0a65bc58fab8e74",
      dynamicTemplateData: {
        name,
        link: `http://localhost:3001/confirmEmail/${user.id}/${token}`,
      },
    }

    sgMail
      .send(msg)
      .then((response) => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // return new user
  // res.json({
  //   id: user.id,
  //   email: user.email,
  //   message: "Registro exitoso, inicie sesión",
  // })
  res.status(200).json({ message: "Creado con éxito" })
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  console.log(email, password)

  const existUser = await prisma.user.findFirst({ where: { email } })

  if (!existUser) {
    return res
      .status(409)
      .json({ message: "El email ingresado no se encuentra registrado" })
  }

  if (await bcrypt.compare(password, existUser.password)) {
    if (!existUser.confirmEmail) {
      return res.status(403).json({ message: "Su usuario no esta confimado" })
    }

    const token = jwt.sign(
      { user_id: existUser.id, email },
      process.env.TOKEN_KEY || "",
      {
        expiresIn: "7d",
      }
    )

    res.status(201).json({
      id: existUser.id,
      name: existUser.name,
      email: existUser.email,
      token: token,
    })
  } else {
    res.status(403).json({ message: "Credenciales incorrectas" })
  }
}

export const getStatus = (req: Request, res: Response) => {
  res.status(200).json({ message: "Token valid" })
}

export const confirmEmail = async (req: Request, res: Response) => {
  const { id, token } = req.params

  const checkInfoUser = await prisma.user.findFirst({
    where: {
      id: +id,
      tokenEmail: token,
    },
  })

  // Verify if data is correct and confirmEmail == true
  if (!checkInfoUser || checkInfoUser.confirmEmail) {
    return res.status(409).render("confirmEmailError", {
      error: "Usuario inexistente o token inválido",
    })
  }

  try {
    await prisma.user.update({
      where: {
        id: checkInfoUser.id,
      },
      data: {
        confirmEmail: true,
      },
    })

    return res
      .status(409)
      .render("confirmEmailSuccess", { name: checkInfoUser.name })
  } catch (error) {
    console.log("Error confirmEmail", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}
