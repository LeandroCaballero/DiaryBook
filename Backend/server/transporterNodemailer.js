import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "diarybook.arg@gmail.com",
    pass: "diarybook2023",
  },
})
