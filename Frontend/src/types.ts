import { Group, Purchase, Summary } from "./interfaces/prisma.interfaces"

export type AuthStackParamList = {
  Home: undefined
  CreatePurchase: { group: Group; title: string; userInfo?: userInfo }
  Group: { group: Group; title: string }
  PurchaseDetails: { purchase: Purchase }
  SummaryDetails: {
    summary: Summary
    users: {
      [x: string]: string
    }[]
  }
  CreateGroup: undefined
  Profile: undefined
  Settings: { user: userInfo }
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

export type ParamId = {
  id: string
}
