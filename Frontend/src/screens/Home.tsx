import React, { useContext, useEffect, useLayoutEffect, useState } from "react"
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native"
import ContentLoader, { List } from "react-content-loader/native"
import { SafeAreaView } from "react-native-safe-area-context"
import { PlusIcon } from "react-native-heroicons/outline"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { UserCircleIcon } from "react-native-heroicons/outline"
import CarouselGroups from "../components/Home/CarouselGroups"
import PurchaseComponent from "../components/Home/PurchaseComponent"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AuthStackParamList } from "../types"
import { Group, Purchase } from "../interfaces/prisma.interfaces"
import { API_URL } from "../../config"

type Props = NativeStackScreenProps<AuthStackParamList, "Home">

const Home = ({ navigation }: Props) => {
  const [data, setData] = useState<{
    groups: Group[]
    purchases: Purchase[]
  }>({ groups: [], purchases: [] })
  const [user, setUser] = useState<{
    id: number
    name: string
    email: string
    token: string
  }>()
  const [loading, setLoading] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])

  useEffect(() => {
    // console.log(data)
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      let userInfo = (await AsyncStorage.getItem("userInfo")) || ""
      const [groups, purchases] = await Promise.all([
        await fetch(`${API_URL}/groups/${JSON.parse(userInfo).id}`),
        await fetch(`${API_URL}/purchases`),
      ])

      // console.log(groups, purchases)

      const groupsJSON: Group[] = await groups.json()
      const purchasesJSON: Purchase[] = await purchases.json()

      setUser(JSON.parse(userInfo))

      // console.log("grupos", typeof groupsJSON)

      setData({ groups: groupsJSON, purchases: purchasesJSON })
    } catch (error) {
      // console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const toDetails = (id: number) => {
    navigation.navigate("PurchaseDetails", { purchaseId: id })
  }

  return (
    <SafeAreaView className="p-3 h-full">
      <View className="flex flex-row justify-between">
        <Text className="text-xl">Bienvenido {user?.name}</Text>
        <Pressable
          onPress={() => navigation.navigate("Profile")}
          className="rounded-full border p-0.5"
        >
          <UserCircleIcon size={30} color="#000000" />
        </Pressable>
      </View>

      <Pressable
        onPress={() => navigation.navigate("CreatePurchase")}
        className=" absolute bottom-5 right-5 rounded-full p-5 z-10"
      >
        <PlusIcon size={30} color="#FFFFFF" />
      </Pressable>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }
        className="flex flex-column"
      >
        <View className="flex flex-row justify-between mt-5">
          <Text className="text-lg">Mis grupos</Text>
          <Pressable
            onPress={() => navigation.navigate("CreateGroup")}
            className="rounded-full border p-0.5"
          >
            <PlusIcon size={25} color="#000000" />
          </Pressable>
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <CarouselGroups groups={data.groups} navigation={navigation} />
        )}
        <View className="flex flex-row justify-between mt-5">
          <Text className="text-lg">Mis últimas compras</Text>
          <Pressable
            onPress={() => navigation.navigate("CreatePurchase")}
            className="rounded-full border p-0.5"
          >
            <PlusIcon size={25} color="#000000" />
          </Pressable>
        </View>

        {loading ? (
          <List width="300" height="300" />
        ) : data.purchases.length > 0 ? (
          data.purchases.map((purchase) => (
            <PurchaseComponent
              item={purchase}
              key={purchase.id}
              navigation={navigation}
            />
          ))
        ) : (
          <Text className="my-2">Sin resultados</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home
