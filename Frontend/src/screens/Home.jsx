import React, { useEffect, useLayoutEffect, useState } from "react"
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

import CarouselGroups from "../components/Home/CarouselGroups"
import PurchaseComponent from "../components/Home/PurchaseComponent"

import { useFetch } from "../hooks/useFetch"

const Home = ({ navigation }) => {
  // const navigation = useNavigation()
  // const { data } = useFetch("http://192.168.0.14:3001/groups")
  const [data, setData] = useState({ groups: [], purchases: [] })
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
      const [groups, purchases] = await Promise.all([
        await fetch("http://192.168.0.14:3001/groups"),
        await fetch("http://192.168.0.14:3001/purchases"),
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

  const toDetails = () => {
    navigation.navigate("PurchaseDetails")
  }

  return (
    <SafeAreaView className="p-3 h-full bg-blue-800">
      <Text className="text-2xl text-white">Bienvenido Leandro</Text>

      <Pressable
        onPress={() => navigation.navigate("CreatePurchase")}
        className="border-2 border-white absolute bottom-5 right-5 rounded-full p-5 z-10"
      >
        <PlusIcon size={30} color="#FFFFFF" />
      </Pressable>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }
        className="flex flex-column"
      >
        {/* <ChevronDownIcon size={30} color="#D24729" />
        <Button
          title="Registro"
          onPress={() => navigation.navigate("Register")}
        />
        <Button title="Login" onPress={() => navigation.navigate("Login")} /> */}
        <Text className="text-lg text-white">Mis grupos</Text>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <CarouselGroups groups={data.groups} />
        )}
        <Text className="text-lg text-white">Mis ultimas compras</Text>
        {loading ? (
          <List width="300" height="300" />
        ) : (
          // <PurchaseList purchases={data.purchases} />
          data.purchases.map((purchase) => (
            <PurchaseComponent
              item={purchase}
              key={purchase.id}
              toDetailsScreen={toDetails}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home
