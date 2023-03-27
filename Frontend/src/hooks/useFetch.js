import { useEffect, useState } from "react"

export function useFetch(url) {
  const [data, setData] = useState(null)

  useEffect(() => {
    get()
  }, [])

  const get = async () =>
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        setData(data)
      })

  return { data }
}
