import { User } from "./prisma.interfaces"

interface NewPurchaseItem {
  name: string
  quantity: string
  forUsers: User[]
  price: string
}

export { NewPurchaseItem }
