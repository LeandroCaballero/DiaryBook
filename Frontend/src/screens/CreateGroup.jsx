import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native"
import React, { useLayoutEffect, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Mantén tus compras bajo control

const CreateGroup = ({ navigation }) => {
  const [loading, setLoading] = useState(false)
  const [textAvailability, setTextAvailability] = useState({
    text: null,
    color: null,
    available: false,
  })
  const [nameGroup, setNameGroup] = useState()

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Agregar grupo",
    })
  }, [])

  const checkAvailabilityGroup = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo")
    console.log("Nombre del group", nameGroup)
    try {
      setLoading(true)
      const response = await fetch("http://192.168.0.14:3001/checkGroupName", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameGroup,
        }),
      })

      const json = await response.json()
      console.log("Respuesta", json)

      if (response?.ok) {
        setTextAvailability({ text: json.text, color: json.color })
      }
    } catch (error) {
      //   ToastAndroid.show(
      //     "Hubo un error, comuniquese con Lean!",
      //     ToastAndroid.SHORT
      //   )
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="bg-white h-full p-3">
      {/* Loading */}
      {loading && (
        <View className="bg-gray-500 absolute h-screen z-10 w-screen opacity-50 flex items-center justify-center">
          <Image
            className="w-20 h-20 mb-20"
            source={require("../assets/loading.gif")}
            //   src={
            //     "https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif"
            //   }
          />
        </View>
      )}
      <Text className="">Nombre del grupo</Text>
      <TextInput
        onChangeText={(e) => setNameGroup(e)}
        placeholder="Ingrese un nombre..."
        className=" p-1 mt-1 rounded-lg bg-gray-50 w-fit"
      />
      {textAvailability && (
        <Text className={`text-${textAvailability.color}`}>
          {textAvailability.text}
        </Text>
      )}
      <View className="flex flex-row justify-center my-3">
        <TouchableOpacity
          className="border border-green-500 mb-3 py-2 px-2"
          onPress={checkAvailabilityGroup}
          //   onPress={() => setModalVisible(!modalVisible)}
        >
          <Text className="text-green-500">Comprobar disponibilidad</Text>
        </TouchableOpacity>
      </View>

      <Text className="">Unirse a un grupo existente</Text>
      <TextInput
        // onChangeText={(e) => setData({ ...data, name: e })}
        // value={data.name}
        placeholder="Ingrese un identificador de grupo"
        className=" p-1 mt-1 rounded-lg bg-gray-50 w-fit"
      />
    </SafeAreaView>
  )
}

export default CreateGroup
