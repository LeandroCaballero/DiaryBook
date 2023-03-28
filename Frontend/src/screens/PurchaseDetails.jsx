import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native"
import React, { useEffect, useLayoutEffect, useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/es"

const PurchaseDetails = ({ route }) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    dayjs.locale("es")
    // console.log(route.params.purchase)
    try {
      const response = await fetch(
        `http://192.168.0.14:3001/purchase/${route.params.purchaseID}`
      )
      const json = await response.json()
      // console.log("en detalles", json)

      setData(json)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchData} />
      }
      className="flex flex-column bg-blue-800 h-full"
    >
      <Text className="text-white text-xl text-center">{data?.name}</Text>
      <Text className="text-white text-xl text-center">
        {dayjs(data?.dateBuy).format("DD [de] MMMM")}
      </Text>
      <Text className="text-white text-xl text-center">Detalles</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        data?.PurchaseItems.map((purchase) => (
          <Text className="text-white" key={purchase.id}>
            {purchase.Product.name}
          </Text>
        ))
      )}
    </ScrollView>
  )
}

export default PurchaseDetails
