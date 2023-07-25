import { API_URL } from "../../config"
import { ParamId } from "../types"

export const getPurchases = async ({ id }: ParamId) => {
  const res = await fetch(`${API_URL}/purchases/${id}`)
  return await res.json()
}

export const getOnePurchase = async ({ id }: ParamId) => {
  const res = await fetch(`${API_URL}/purchase/${id}`)
  return await res.json()
}
