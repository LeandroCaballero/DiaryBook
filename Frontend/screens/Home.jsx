import { View, Text, Button } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ChevronDownIcon } from "react-native-heroicons/solid"

import React, { useLayoutEffect } from "react"
import { useNavigation } from "@react-navigation/native"

const Home = ({ navigation }) => {
  // const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])

  const fetchData = () => {}

  return (
    <SafeAreaView>
      <Text className="text-2xl text-red-800">Inicio</Text>
      <View className="flex flex-row">
        <ChevronDownIcon size={30} color="#D24729" />
        <Button
          title="Registro"
          onPress={() => navigation.navigate("Register")}
        />
        <Button title="Login" onPress={() => navigation.navigate("Login")} />

        {/* <Text className="text-2xl text-red-800">Inicio dale</Text>
        <Text className="text-2xl text-red-800">Inicio dale</Text>
        <Text className="text-2xl text-red-800">Inicio dale</Text> */}
      </View>
    </SafeAreaView>
  )
}

export default Home
