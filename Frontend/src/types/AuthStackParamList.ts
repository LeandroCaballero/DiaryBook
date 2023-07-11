import { Group } from "../interfaces/prisma.interfaces"

export type AuthStackParamList = {
  Home: undefined
  CreatePurchase: undefined
  Group: { group: Group }
  PurchaseDetails: { purchaseId: number }
  CreateGroup: undefined
}
