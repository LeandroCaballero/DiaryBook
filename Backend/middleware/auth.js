import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers.authorization.split(" ")[1]

  console.log(token)

  if (!token) {
    return res.status(403).send("Se necesita un token")
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY)
    req.user = decoded
  } catch (err) {
    return res.status(401).send("Token inválido")
  }
  return next()
}
