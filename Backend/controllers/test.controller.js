import { prisma } from "../server/prisma.js"
import mindee from "mindee"
import axios from "axios"
import fs from "fs"
import FormData from "form-data"

export const getTest = async (req, res) => {
  // console.log("entra")
  let token = "378ccf5fd6742e91d73427dbfff882c5"
  let data = new FormData()
  // data.append("document", req.files.photo)
  data.append("document", fs.createReadStream("./ticket.jpg"))

  // console.log(typeof req.files)

  const config = {
    method: "POST",
    url: "https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict",
    headers: {
      Authorization: `Token ${token}`,
      //   "Content-Type": "multipart/form-data",
      ...data.getHeaders(),
    },
    data,
  }

  try {
    let response = await axios(config)
    res.status(200).json(response.data)
    // console.log(response.data)
  } catch (error) {
    console.log(error)
  }

  // res.status(200).json({ message: "hola" })
}
