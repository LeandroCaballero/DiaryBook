import express from "express"
import cors from "cors"
import router from "./routes/index.routes.js"
import dotenv from "dotenv"

dotenv.config()

const app = express()

// app.put("/publish/:id", async (req, res) => {
//   const { id } = req.params
//   const post = await prisma.post.update({
//     where: { id },
//     data: { published: true },
//   })
//   res.json(post)
// })

// app.delete("/user/:id", async (req, res) => {
//   const { id } = req.params
//   const user = await prisma.user.delete({
//     where: {
//       id,
//     },
//   })
//   res.json(user)
// })

app.use(express.json())
app.use(cors())
app.use(router)

app.listen(process.env.PORT, (req, res) =>
  console.log(`Server running on port ${process.env.PORT}`)
)
