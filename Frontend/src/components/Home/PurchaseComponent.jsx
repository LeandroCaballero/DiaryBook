import { View, Text, FlatList, TouchableOpacity } from "react-native"
import { ShoppingCartIcon } from "react-native-heroicons/outline"
import React from "react"
import dayjs from "dayjs"
import "dayjs/locale/es"
import { useNavigation } from "@react-navigation/native"

const PurchaseItem = ({ item }) => {
  const navigation = useNavigation()
  dayjs.locale("es")
  return (
    <TouchableOpacity
      className="border p-2 border-white rounded-md my-2 w-full"
      onPress={() =>
        navigation.navigate("PurchaseDetails", { purchaseID: item.id })
      }
    >
      <View className="flex flex-row gap-x-2 items-center">
        <View className="w-fit border-2 p-1 border-white rounded-md">
          <ShoppingCartIcon size={30} color="#FFFFFF" />
        </View>
        <Text className="w-3/6 col-span-5 text-white">{item.name}</Text>
        <View className="flex flex-col w-2/6">
          <Text className="text-white">{calculateTotalPurchaseItem(item)}</Text>
          <Text className="text-white">
            {dayjs(item.dateBuy).format("DD [de] MMMM")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const calculateTotalPurchaseItem = (purchace) => {
  const total = purchace.PurchaseItems.reduce(
    (acc, curr) => acc + curr.total,
    0
  )
  return `$${total}`
}

export default PurchaseItem
