import { View, Text, FlatList, TouchableOpacity } from "react-native"
import { ShoppingCartIcon } from "react-native-heroicons/outline"
import React from "react"

const PurchaseItem = ({ item }) => {
  return (
    <TouchableOpacity className="border p-2 border-white rounded-md my-2 w-full">
      <View className="flex flex-row gap-x-2 items-center">
        <View className="w-fit border-2 p-1 border-white rounded-md">
          <ShoppingCartIcon size={30} color="#FFFFFF" />
        </View>
        <Text className="w-3/6 col-span-5 text-white">{item.id}</Text>
        <Text className="w-2/6 text-white">{item.id}</Text>
      </View>
    </TouchableOpacity>
  )
}
export default PurchaseItem
