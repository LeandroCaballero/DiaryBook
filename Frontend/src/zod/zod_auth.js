import { z } from "zod"

const zod_registerUser = z.object({
  name: z
    .string({ required_error: "Este campo no puede estar vacío" })
    .min(2, { message: "Ingrese 2 o mas letras" })
    .refine((value) => /^[A-Za-z.\s]+$/.test(value), {
      message: "Solo se aceptan letras, espacios y punto(.)",
      path: [],
    }),
  email: z
    .string({ required_error: "Ingrese un correo" })
    .email({ message: "Ingrese un correo válido" }),
  password: z
    .string({ required_error: "Ingrese un correo" })
    .min(8, { message: "Mínimo de 8 caracteres" }),
  confirmPassword: z.string().superRefine(({ confirmPassword }, ctx) => {
    if (confirmPassword == password) {
      ctx.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
      })
    }
  }),
})

export { zod_registerUser }
