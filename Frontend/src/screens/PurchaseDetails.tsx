import {
  TouchableOpacity,
  Modal,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native"
import React, { useEffect, useRef, useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/es"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AuthStackParamList } from "../types"
import { Purchase } from "../interfaces/prisma.interfaces"
import Collapsible from "react-native-collapsible"

type Props = NativeStackScreenProps<AuthStackParamList, "PurchaseDetails">

const PurchaseDetails = ({ route }: Props) => {
  const [data, setData] = useState<Purchase>()
  const [loading, setLoading] = useState(false)

  const [isCollapsed, setIsCollapsed] = useState<
    Array<{ isCollapsed: boolean }>
  >([])

  useEffect(() => {
    const { purchase } = route.params
    setData(purchase)
    setIsCollapsed(purchase.PurchaseItems.map(() => ({ isCollapsed: true })))
  }, [])

  return (
    <ScrollView className="flex flex-column h-full p-3">
      <Text className="text-xl text-center">{data?.name}</Text>
      <Text className="text-center">
        {dayjs(data?.dateBuy).format("DD [de] MMMM")}
      </Text>
      <Text className="my-2 text-lg">Lista de items</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        data?.PurchaseItems.map((purchaseItem, index) => (
          <TouchableOpacity
            key={purchaseItem.id}
            className="border p-2 mt-2 rounded-lg"
            onPress={() =>
              setIsCollapsed((prevData) => {
                prevData[index].isCollapsed = !prevData[index].isCollapsed
                return [...prevData]
              })
            }
          >
            <View className="flex flex-row justify-between">
              <Text>{purchaseItem.productName}</Text>
              <Text>Total: ${purchaseItem.total}</Text>
            </View>
            <Collapsible collapsed={isCollapsed[index].isCollapsed}>
              <View className="flex flex-row justify-between">
                <Text>Cantidad: {purchaseItem.quantity}</Text>
                <Text>Precio: ${purchaseItem.price}</Text>
              </View>
              <Text className="text-center">Para quién es?</Text>
              {purchaseItem.forUsers.map((user) => (
                <Text key={user.id} className="text-center">
                  {user.name}
                </Text>
              ))}
            </Collapsible>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  )
}

export default PurchaseDetails
