import { TransactionStatus } from "../enums"

interface User {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
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
  id: string
  createdAt: Date
  updatedAt: Date
  name: String
  Admins: User[]
  Users: User[]
  Purchases: Purchase[]
  RequestUsers: User[]
  Summaries: Summary[]
}

interface Purchase {
  id: string
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
  id: string
  createdAt: Date
  updatedAt: Date
  quantity: number
  productName: String
  price: number
  forUsers: User[]
  total: number

  Purchase: Purchase | undefined
  purchaseId: number | undefined
}

interface Summary {
  id: string
  createdAt: Date
  updatedAt: Date
  dateStart: Date
  dateEnd: Date
  Group: Group
  Transactions: Transaction[]
}

interface Transaction {
  id: string
  createdAt: Date
  updatedAt: Date
  status: TransactionStatus
  Summary: Summary
  buyerId: string
  debtorId: string
  amount: number
}

export { Group, Purchase, PurchaseItem, User, Summary, Transaction }
