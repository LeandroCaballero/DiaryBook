import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from "react-native"
import React, { useLayoutEffect, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { zod_checkNameGroup } from "../zod/zod_createGroup"
// Mantén tus compras bajo control

const CreateGroup = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState<{
    id: number
    name: string
    email: string
    token: string
  }>()
  const [loading, setLoading] = useState(false)
  const [nameGroup, setNameGroup] = useState<string>()
  const [textAvailability, setTextAvailability] = useState<{
    text: string
    color: string
    available: boolean
  }>()
  const [error, setError] = useState()

  const [numberGroup, setNumberGroup] = useState<string>()

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo")
    // console.log("usuario", userInfo)
    setUser(JSON.parse(userInfo || ""))
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Agregar grupo",
    })
  }, [])

  const checkAvailabilityGroup = async () => {
    try {
      zod_checkNameGroup.parse({ nameGroup })
      setLoading(true)
      const response = await fetch("http://192.168.0.14:3001/checkGroupName", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameGroup,
        }),
      })

      const json = await response.json()
      // console.log("Respuesta", json)

      if (response?.ok) {
        setTextAvailability({
          text: json.text,
          color: json.color,
          available: true,
        })
        setError(undefined)
      }
    } catch (error: any) {
      setError(JSON.parse(error.message)[0].message)
      setTextAvailability(undefined)
    } finally {
      setLoading(false)
    }
  }

  const checkExistGroup = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `http://192.168.0.14:3001/checkExistGroup/${numberGroup}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )

      const json = await response.json()
      // console.log("Respuesta", json)

      if (response?.ok) {
        // console.log("respuesta", json)
      }
    } catch (error) {
      // console.log(error)
    }
  }

  const createGroup = async () => {
    try {
      zod_checkNameGroup.parse({ nameGroup })
      setLoading(true)
      console.log("antes de mandar", typeof user)

      const response = await fetch("http://192.168.0.14:3001/group", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameGroup,
          user: user?.id,
        }),
      })

      if (response?.ok) {
        console.log("todo ok")
      }
    } catch (error: any) {
      setError(JSON.parse(error?.message)[0]?.message)
      setTextAvailability(undefined)
    } finally {
      setLoading(false)
      ToastAndroid.show("Grupo creado con éxito", ToastAndroid.SHORT)
      navigation.navigate("Home")
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
      {error && <Text className="text-red-500">{error}</Text>}
      <View className="flex flex-row justify-between my-3">
        <TouchableOpacity
          className="border border-green-500 mb-3 py-2 px-2"
          onPress={checkAvailabilityGroup}
          //   onPress={() => setModalVisible(!modalVisible)}
        >
          <Text className="text-blue-500">Comprobar disponibilidad</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="border border-green-500 mb-3 py-2 px-2"
          onPress={createGroup}
          //   onPress={() => setModalVisible(!modalVisible)}
        >
          <Text className="text-green-500">Crear grupo</Text>
        </TouchableOpacity>
      </View>

      <Text className="">Unirse a un grupo existente</Text>
      <TextInput
        onChangeText={(e) => setNumberGroup(e)}
        // value={data.name}
        placeholder="Ingrese un identificador de grupo"
        className=" p-1 mt-1 rounded-lg bg-gray-50 w-fit"
      />
      <View className="flex flex-row justify-center my-3">
        <TouchableOpacity
          className="border border-green-500 mb-3 py-2 px-2"
          onPress={checkExistGroup}
          //   onPress={() => setModalVisible(!modalVisible)}
        >
          <Text className="text-green-500">Comprobar existencia</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default CreateGroup
