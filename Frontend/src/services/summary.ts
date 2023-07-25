import { API_URL } from "../../config"
import { ParamId } from "../types"

interface PropsCreate {
  dateStart: Date
  dateEnd: Date
  groupId: string
}

export const createSummary = async ({
  dateStart,
  dateEnd,
  groupId,
}: PropsCreate) => {
  const res = await fetch(`${API_URL}/summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dateStart, dateEnd, groupId }),
  })
  return await res.json()
}
