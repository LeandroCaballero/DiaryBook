import { API_URL } from "../../config"
import { ParamId } from "../types"

interface PropsCreate {
  dateStart: Date
  dateEnd: Date
  groupId: string
  userId?: string
}

export const createSummary = async ({
  dateStart,
  dateEnd,
  groupId,
  userId,
}: PropsCreate) => {
  const res = await fetch(`${API_URL}/summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dateStart, dateEnd, groupId, userId }),
  })
  return await res.json()
}