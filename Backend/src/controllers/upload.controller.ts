import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Request, Response } from "express"
import prisma from "../server/prisma"

export const uploadLogo = async (req: any, res: Response) => {
  const client = new S3Client({
    credentials: {
      accessKeyId: process.env.accessKeyId || "",
      secretAccessKey: process.env.secretAccessKey || "",
    },
    region: "sa-east-1",
  })

  const id = req.body.id
  const image = req.files?.photo.data

  const command = new PutObjectCommand({
    Bucket: "diarybookfiles",
    Key: `Logos/${id}.jpg`,
    Body: image,
    ACL: "public-read",
    ContentType: "image/jpg",
  })

  try {
    await client.send(command)

    const updateUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        profileImage: `https://diarybookfiles.s3.sa-east-1.amazonaws.com/Logos/${id}.jpg`,
      },
    })

    if (updateUser) {
      console.log("todo bien")
      return res
        .status(200)
        .json({ message: "Se actualizó la foto de perfil!" })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).send("Algo falló")
  }
}
