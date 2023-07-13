import express, { Request, Response } from "express"
import cors from "cors"
import router from "./routes/index.routes"
import dotenv from "dotenv"
import fileupload from "express-fileupload"
import path from "path"

dotenv.config()
const app = express()

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(express.json())
app.use(cors())
app.use(fileupload())
app.use(router)
app.use(express.static("public"))

const port = process.env.PORT || "8080"

app.listen(port, () =>
  console.log(`Server running on port ${process.env.PORT}`)
)
