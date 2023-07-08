import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

// Asi se agregan propiedades a un tipo de ts
interface CustomRequest extends Request {
  user?: any
}

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(403).json({ message: "Se necesita un token" })
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY || "")
    req.user = decoded
  } catch (err) {
    return res.status(401).send("Token inválido")
  }
  return next()
}
