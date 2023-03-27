import React, { useEffect, useLayoutEffect, useState } from "react"
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import CarouselGroups from "../components/Home/CarouselGroups"
import PurchaseItem from "../components/Home/PurchaseItem"

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
        await fetch("http://192.168.0.14:3001/purchase"),
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

    // try {
    //   const response = await fetch("http://192.168.0.14:3001/groups")

    //   const json = await response.json()
    //   setData(json)
    // } catch (error) {
    //   console.error(error)
    // } finally {
    //   // console.log("Grupos", data)
    //   setLoading(false)
    // }
  }

  return (
    <SafeAreaView className=" p-3 h-full bg-blue-800 ">
      <Text className="text-2xl text-white">Bienvenido Leandro</Text>

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
          <ActivityIndicator />
        ) : (
          // <PurchaseList purchases={data.purchases} />
          data.purchases.map((purchase) => (
            <PurchaseItem item={purchase} key={purchase.id} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home
