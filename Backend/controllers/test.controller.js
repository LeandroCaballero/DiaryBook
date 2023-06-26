import { prisma } from "../server/prisma.js"
import axios from "axios"

export const getTest = async (req, res) => {
  console.log("Empieza")

  let token = "378ccf5fd6742e91d73427dbfff882c5"

  const data = {
    document: Buffer.from(req.files.photo.data).toString("base64"),
  }

  const config = {
    method: "POST",
    url: "https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "multipart/form-data",
      // ...data.getHeaders(),
    },
    data,
  }

  try {
    let response = await axios(config)
    console.log(response.data.document.inference.prediction.line_items)
    res
      .status(200)
      .json(
        response.data.document.inference.prediction.line_items.filter(
          (el) => el.confidence >= 0.9
        )
      )
    // console.log(response.data.document)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "error" })
  }

  // res.status(200).json({ message: "hola" })
}
