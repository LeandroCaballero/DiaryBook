import { API_URL } from "../../config"
import { ParamId } from "../types"

export const getGroups = async ({ id }: ParamId) => {
  const res = await fetch(`${API_URL}/groups/${id}`)
  return await res.json()
}
