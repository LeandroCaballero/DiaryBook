import express from "express"
import cors from "cors"
import router from "./routes/index.routes.js"
import dotenv from "dotenv"
import fileupload from "express-fileupload"
import { fileURLToPath } from "url"
import path, { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()
const app = express()

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(express.json())
app.use(cors())
app.use(fileupload())
app.use(router)

const port = process.env.PORT || "8080"

app.listen(port, (req, res) =>
  console.log(`Server running on port ${process.env.PORT}`)
)
