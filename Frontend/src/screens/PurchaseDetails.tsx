import {
  TouchableOpacity,
  Modal,
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from "react-native"
import React, { useEffect, useLayoutEffect, useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/es"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AuthStackParamList } from "../types"
import { Purchase } from "../interfaces/prisma.interfaces"
import { API_URL } from "../../config"

type Props = NativeStackScreenProps<AuthStackParamList, "PurchaseDetails">

const PurchaseDetails = ({ route }: Props) => {
  const [data, setData] = useState<Purchase>()
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    dayjs.locale("es")
    // console.log(route.params.purchase)
    try {
      const response = await fetch(
        `${API_URL}/purchase/${route.params.purchaseId}`
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
          <TouchableOpacity
            key={purchase.id}
            className="border border-white mb-3 py-2"
            onPress={() => setModalVisible(!modalVisible)}
          >
            {/* <Text className="text-white">{purchase.Product.name}</Text> */}
            <Text>Test</Text>
          </TouchableOpacity>
        ))
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View className="flex flex-row justify-center items-center">
          <View className="bg-white rounded-md p-3">
            <Text className="text-center">Hello Worlds!</Text>
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              <Text>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default PurchaseDetails
