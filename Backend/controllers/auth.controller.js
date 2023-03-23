import bcrypt from "bcryptjs"
import { prisma } from "../server/prisma.js"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  const { name, email, password } = req.body
  // console.log(name, email, password)

  const oldUser = await prisma.user.findFirst({ where: { email } })

  if (oldUser) {
    return res.status(409).json({ message: "El email ya existe" })
  }

  let encryptedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: encryptedPassword,
    },
  })

  const token = jwt.sign({ user_id: user.id, email }, process.env.TOKEN_KEY, {
    expiresIn: "2h",
  })

  // AsyncStorage.setItem('userInfo', JSON.stringify(user));

  // return new user
  res.json({
    id: user.id,
    email: user.email,
    token: token,
    message: "Registro exitoso, inicie sesión",
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  // console.log(email, password)

  const existUser = await prisma.user.findFirst({ where: { email } })

  if (!existUser) {
    return res
      .status(409)
      .json({ message: "El email ingresado no se encuentra registrado" })
  }

  if (await bcrypt.compare(password, existUser.password)) {
    const token = jwt.sign(
      { user_id: existUser.id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "7d",
      }
    )

    // const { id, name, email } = existUser
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

export const getStatus = (req, res) => {
  res.status(200).json({ message: "Token valid" })
}
