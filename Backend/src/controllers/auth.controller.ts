import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../server/prisma"
import sgMail from "@sendgrid/mail"
import crypto from "crypto"
import { Request, Response } from "express"

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
    // SENDGRID_API_KEY
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

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
        // console.log(response[0].statusCode)
        // console.log(response[0].headers)

        res.status(200).json({
          message: "Se ha enviado un email de confirmación para su cuenta",
        })
      })
      .catch((error) => {
        console.error("ERROR de mail!!", error)
        return res
          .status(500)
          .json({ message: "Hubo un error, por favor intente más tarde" })
      })
  }
}

export const login = async (req: Request, res: Response) => {
  const { emailOrName, password } = req.body

  const existUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: emailOrName,
        },
        {
          name: emailOrName,
        },
      ],
    },
  })

  if (!existUser) {
    return res
      .status(409)
      .json({ message: "El usuario no se encuentra registrado" })
  }

  if (await bcrypt.compare(password, existUser.password)) {
    if (!existUser.confirmEmail) {
      return res.status(403).json({ message: "Su usuario no esta confirmado" })
    }

    const token = jwt.sign(
      { user_id: existUser.id, emailOrName },
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
      profileImage: existUser.profileImage,
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
      id: id,
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
      .status(200)
      .render("confirmEmailSuccess", { name: checkInfoUser.name })
  } catch (error) {
    console.log("Error confirmEmail", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

export const changePassword = async (req: Request, res: Response) => {
  const { userId, oldPassword, newPassword } = req.body

  const existUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  })

  if (existUser) {
    if (await bcrypt.compare(oldPassword, existUser.password)) {
      let encryptedPassword = await bcrypt.hash(newPassword, 10)

      try {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: encryptedPassword,
          },
        })
        return res
          .status(200)
          .json({ message: "Contraseña cambiada con éxito!" })
      } catch (error) {
        console.log("ERROR CHANGE PASS", error)
        return res.status(500).json({
          message: "Hubo un error al cambiar la contraseña, intente más tarde",
        })
      }
    } else {
      return res
        .status(403)
        .json({ message: "La contraseña actual es incorrecta!" })
    }
  }
}

export const sendCodeRecoverPassword = async (req: Request, res: Response) => {
  const { userEmail } = req.body

  const newCodeRecover: number[] = []

  for (let i = 0; i < 4; i++) {
    const randomNumber = Math.floor(Math.random() * 10)
    newCodeRecover.push(randomNumber)
  }

  const setUserCode = await prisma.user.update({
    where: {
      email: userEmail,
    },
    data: {
      codeRecoverPassword: newCodeRecover.join(""),
    },
  })

  if (setUserCode) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

    const msg = {
      to: userEmail,
      from: "diarybook.arg@gmail.com",
      templateId: "d-470f832126af4f4c910eb878f3e0b516",
      dynamicTemplateData: {
        name: setUserCode.name,
        code: setUserCode.codeRecoverPassword,
      },
    }

    sgMail
      .send(msg)
      .then(() => {
        setTimeout(async () => {
          const deleteCode = await prisma.user.update({
            where: {
              email: userEmail,
            },
            data: {
              codeRecoverPassword: null,
            },
          })
        }, 60000)

        return res.status(200).json({
          message: "Se ha enviado un email con el código de recuperación",
        })
      })
      .catch((error) => {
        console.error("ERROR de mail!!", error)
        return res
          .status(500)
          .json({ message: "Hubo un error, por favor intente más tarde" })
      })
  }
}

export const send = async (req: Request, res: Response) => {
  const { userEmail } = req.body

  const newCodeRecover: number[] = []

  for (let i = 0; i < 4; i++) {
    const randomNumber = Math.floor(Math.random() * 10)
    newCodeRecover.push(randomNumber)
  }

  const setUserCode = await prisma.user.update({
    where: {
      email: userEmail,
    },
    data: {
      codeRecoverPassword: newCodeRecover.join(""),
    },
  })

  if (setUserCode) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

    const msg = {
      to: userEmail,
      from: "diarybook.arg@gmail.com",
      templateId: "d-470f832126af4f4c910eb878f3e0b516",
      dynamicTemplateData: {
        name: setUserCode.name,
        code: setUserCode.codeRecoverPassword,
      },
    }

    sgMail
      .send(msg)
      .then(() => {
        setTimeout(async () => {
          const deleteCode = await prisma.user.update({
            where: {
              email: userEmail,
            },
            data: {
              codeRecoverPassword: null,
            },
          })
        }, 60000)

        return res.status(200).json({
          message: "Se ha enviado un email con el código de recuperación",
        })
      })
      .catch((error) => {
        console.error("ERROR de mail!!", error)
        return res
          .status(500)
          .json({ message: "Hubo un error, por favor intente más tarde" })
      })
  }
}
