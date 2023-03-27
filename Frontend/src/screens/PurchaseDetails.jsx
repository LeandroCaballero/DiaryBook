import { View, Text } from "react-native"
import React, { useEffect, useLayoutEffect, useState } from "react"

const PurchaseDetails = () => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // console.log(data)
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [groups, purchases] = await Promise.all([
        await fetch("http://192.168.0.14:3001/groups"),
        await fetch("http://192.168.0.14:3001/purchase"),
      ])

      const groupsJSON = await groups.json()
      const purchasesJSON = await purchases.json()

      // console.log("grupos", groupsJSON)
      // console.log("purchases", purchasesJSON)
      setData({ groups: groupsJSON, purchases: purchasesJSON })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View>
      <Text>PurchaseDetails</Text>
    </View>
  )
}

export default PurchaseDetails
