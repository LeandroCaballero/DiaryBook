import { View, Text, FlatList, TouchableOpacity } from "react-native"
import { DocumentTextIcon } from "react-native-heroicons/outline"
import React, { useEffect, useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/es"
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native"
import { AuthStackParamList } from "../../types"
import { Purchase, Summary, User } from "../../interfaces/prisma.interfaces"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { TransactionStatus } from "../../enums"
dayjs.locale("es")

interface ChildProps {
  item: Summary
  users: {
    [x: string]: string
  }[]
  navigation: any
}

// type Props = NativeStackScreenProps<AuthStackParamList, "PurchaseDetails">

// Desestructuro el "item" de las props donde una de las propiedades se llama 'item'
const SummaryItem = ({ item, navigation, users }: ChildProps) => {
  const [data, setData] = useState({ text: "", color: "" })
  useEffect(() => {
    // console.log(users)
    const total = item.Transactions.reduce((acc, curr) => {
      let totalTemp = 0
      if (curr.status == TransactionStatus.Pending) {
        totalTemp += 1
      }
      return acc + totalTemp
    }, 0)

    const text =
      total > 0
        ? `${total} ${
            total > 1 ? "transacciones pendientes" : "transacción pendiente"
          } `
        : "Sin deudas"
    const color = total > 0 ? "red-500" : "green-500"

    setData({ text, color })
  }, [])

  return (
    <TouchableOpacity
      className={`border border-${data.color} p-2 rounded-md my-2 w-full`}
      onPress={() =>
        navigation.navigate("SummaryDetails", { summary: item, users: users })
      }
    >
      <View className="flex flex-row gap-x-2 items-center">
        <View className={`w-fit border-2 border-${data.color} p-1 rounded-md`}>
          <DocumentTextIcon size={30} color="#EF4444" />
        </View>
        <Text className="w-3/6 col-span-5 ">
          {dayjs(item.dateStart).format("DD [de] MMMM")} a{" "}
          {dayjs(item.dateEnd).format("DD [de] MMMM")}
        </Text>
        <View className="flex flex-col w-2/6">
          <Text className="">{data.text}</Text>
          {/* <Text className="">
            {dayjs(item.dateStart).format("DD [de] MMMM")}
          </Text> */}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default SummaryItem
