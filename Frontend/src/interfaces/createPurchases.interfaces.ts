import { User } from "./prisma.interfaces"

interface NewPurchaseItem {
  productName: string
  quantity: string
  forUsers: Array<{ user: User; checked?: boolean }>
  price: string
}

interface SharedUsers {
  user: User
  checked: boolean
}

export { NewPurchaseItem, SharedUsers }
