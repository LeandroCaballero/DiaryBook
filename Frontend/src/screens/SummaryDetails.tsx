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
import { AuthStackParamList, userInfo } from "../types"
import { Summary } from "../interfaces/prisma.interfaces"
import Collapsible from "react-native-collapsible"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Props = NativeStackScreenProps<AuthStackParamList, "SummaryDetails">

const SummaryDetails = ({ route }: Props) => {
  const [data, setData] = useState<Summary>()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<{ [x: string]: string }>({})

  const [isCollapsed, setIsCollapsed] = useState<
    Array<{ isCollapsed: boolean }>
  >([])

  useEffect(() => {
    const { summary, users } = route.params
    setData(summary)
    setUsers(
      users.reduce((resultado, objeto) => {
        return { ...resultado, ...objeto }
      }, {})
    )
    setIsCollapsed(summary.Transactions.map(() => ({ isCollapsed: true })))
  }, [])

  return (
    <ScrollView className="flex flex-column h-full p-3">
      <Text className="text-xl text-center">Resúmen</Text>
      <Text className="text-center">
        {dayjs(data?.dateStart).format("DD [de] MMMM")} a{" "}
        {dayjs(data?.dateEnd).format("DD [de] MMMM")}
      </Text>
      {/* <Text className="text-center">{data?.?.name}</Text> */}
      <Text className="my-2 text-lg">Lista de transacciones</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        data?.Transactions.map((transaction, index) => (
          <TouchableOpacity
            key={transaction.id}
            className="border p-2 mt-2 rounded-lg"
            onPress={() =>
              setIsCollapsed((prevData) => {
                prevData[index].isCollapsed = !prevData[index].isCollapsed
                return [...prevData]
              })
            }
          >
            <View className="flex flex-row justify-between">
              <Text>Monto: ${transaction.amount}</Text>
              <Text>Estado: {transaction.status}</Text>
            </View>
            <Collapsible collapsed={isCollapsed[index].isCollapsed}>
              <View>
                <Text>Comprador: {users[transaction.buyerId]}</Text>
                <Text>Deudor: {users[transaction.debtorId]}</Text>
              </View>
            </Collapsible>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  )
}

export default SummaryDetails
