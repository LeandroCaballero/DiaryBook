interface User {
  id: number
  createdAt: Date
  updatedAt: Date
  name: String
  email: String
  password: String
  confirmEmail: Boolean
  tokenEmail: String
  Purchases: Purchase[]
  Groups: Group[]
  Admins: Group[]
  PurchaseItem: PurchaseItem[]
  purchaseItemId: number | undefined
}

interface Group {
  id: number
  createdAt: Date
  updatedAt: Date
  name: String
  Admins: User[]
  Users: User[]
  Purchases: Purchase[]
}

interface Purchase {
  id: number
  createdAt: Date
  updatedAt: Date
  dateBuy: Date | undefined
  name: String | undefined
  PurchaseItems: PurchaseItem[]
  Buyer: User
  buyerId: number
  Group: Group
  groupId: number
}

interface PurchaseItem {
  id: number
  createdAt: Date
  updatedAt: Date
  quantity: number
  productName: String
  price: number
  shared: User[]
  total: number

  Purchase: Purchase | undefined
  purchaseId: number | undefined
}

export { Group, Purchase, PurchaseItem, User }
