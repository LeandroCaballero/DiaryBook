import { Group } from "./interfaces/prisma.interfaces"

export type AuthStackParamList = {
  Home: undefined
  CreatePurchase: undefined
  Group: { group: Group; title: string }
  PurchaseDetails: { purchaseId: number }
  CreateGroup: undefined
  Profile: undefined
}

export type AuthenticationStackParamList = {
  Login: undefined
  Register: undefined
}

export type userInfo = {
  id: string
  name: string
  email: string
  token: string
  profileImage?: string
}
