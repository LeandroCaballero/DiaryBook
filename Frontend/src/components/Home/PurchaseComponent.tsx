import { View, Text, FlatList, TouchableOpacity } from "react-native"
import { ShoppingCartIcon } from "react-native-heroicons/outline"
import React from "react"
import dayjs from "dayjs"
import "dayjs/locale/es"
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native"
import { AuthStackParamList } from "../../types"
import { Purchase } from "../../interfaces/prisma.interfaces"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
dayjs.locale("es")

interface ChildProps {
  item: Purchase
  navigation: any
}

// type Props = NativeStackScreenProps<AuthStackParamList, "PurchaseDetails">

// Desestructuro el "item" de las props donde una de las propiedades se llama 'item'
const PurchaseItem = ({ item, navigation }: ChildProps) => {
  // const navigation = useNavigation()
  // const navigation = useNavigation<AuthStackParamList>()

  return (
    <TouchableOpacity
      className="border p-2 border-white rounded-md my-2 w-full"
      onPress={
        () => navigation.navigate("PurchaseDetails", { purchaseId: item.id })
        // console.log("test")
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

const calculateTotalPurchaseItem = (purchace: Purchase) => {
  const total = purchace.PurchaseItems.reduce(
    (acc, curr) => acc + curr.total,
    0
  )
  return `$${total}`
}

export default PurchaseItem
