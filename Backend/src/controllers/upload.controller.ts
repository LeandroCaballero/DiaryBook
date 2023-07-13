import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Request, Response } from "express"

export const uploadLogo = async (req: any, res: Response) => {
  const client = new S3Client({
    credentials: {
      accessKeyId: process.env.accessKeyId || "",
      secretAccessKey: process.env.secretAccessKey || "",
    },
    region: "sa-east-1",
  })

  const id = req.body.id
  const imagen = req.files?.foto.data
  const type = req.body.type

  // try {
  //   await sharp(imagen)
  //     .resize(newWidth, newHeight)
  //     .jpeg({ quality: newQuality })
  //     .toFile(__dirname + "/out/wallpaper.jpg")
  //     .then(() => {
  //       console.log("Imagen procesada exitosamente.")
  //     })
  //     .catch((error) => {
  //       console.error("Error al procesar la imagen:", error)
  //     })
  // } catch (error) {
  //   console.log("ERROR SHARP", error)
  // }

  const command = new PutObjectCommand({
    Bucket: "diarybookfiles",
    Key: `Logos/${id}.jpg`,
    Body: imagen,
    ACL: "public-read",
    ContentType: "image/jpg",
  })

  try {
    await client.send(command)
  } catch (err) {
    console.error(err)
    return res.status(500).send("Algo falló")
  }

  return res.status(200).send("File uploaded successfully!")
}
