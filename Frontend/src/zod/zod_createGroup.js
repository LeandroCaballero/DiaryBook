import { z } from "zod"

const zod_checkNameGroup = z.object({
  nameGroup: z
    .string({ required_error: "Este campo no puede estar vacío" })
    .min(2, { message: "Ingrese 2 o mas letras" })
    .refine((value) => /^[A-Za-z.\s]+$/.test(value), {
      message: "Solo se aceptan letras, espacios y punto(.)",
      path: [],
    }),
})

export { zod_checkNameGroup }
