import express from "express"
import cors from "cors"
import router from "./routes/index.routes.js"
import dotenv from "dotenv"
import fileupload from "express-fileupload"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(fileupload())
app.use(router)

const port = process.env.PORT || "8080"

app.listen(port, (req, res) =>
  console.log(`Server running on port ${process.env.PORT}`)
)
