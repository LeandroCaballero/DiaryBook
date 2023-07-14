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
import { API_URL } from "../../config"
import { userInfo } from "../types"
import { Group } from "../interfaces/prisma.interfaces"
// Mantén tus compras bajo control

const CreateGroup = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState<userInfo>()
  const [loading, setLoading] = useState(false)
  const [nameGroup, setNameGroup] = useState<string>()
  const [textAvailability, setTextAvailability] = useState<{
    text?: string
    color?: string
    available?: boolean
    name?: string
  }>()
  const [textExistGroup, setTextExistGroup] = useState<{
    text?: string
    color?: string
    exist?: boolean
    group?: Group
  }>()
  const [error, setError] = useState()

  const [nameExistGroup, setNameExistGroup] = useState("")

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
      const response = await fetch(`${API_URL}/checkGroupName`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameGroup,
        }),
      })

      const { text, available, name } = await response.json()

      if (response?.ok) {
        setTextAvailability({
          text,
          color: "green-500",
          available,
          name,
        })
      } else {
        setTextAvailability({
          text: text,
          color: "red-500",
          available: available,
          name: name,
        })
      }

      // Reset zod error message
      setError(undefined)
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
        `${API_URL}/checkExistGroup/${nameExistGroup}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )

      const { text, exist, group } = await response.json()

      if (response?.ok) {
        setTextExistGroup({
          text,
          color: "green-500",
          exist,
          group,
        })
        setError(undefined)
      } else {
        setTextExistGroup({
          text,
          color: "red-500",
          exist,
          group,
        })
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      // console.log(error)
    }
  }

  const createGroup = async () => {
    if (nameGroup != textAvailability?.name) {
      setTextAvailability({ ...textAvailability, available: false })
      ToastAndroid.show(
        "Nombre incorrecto no te hagas el vivo",
        ToastAndroid.SHORT
      )
      return
    }
    try {
      zod_checkNameGroup.parse({ nameGroup })
      setLoading(true)

      const response = await fetch(`${API_URL}/group`, {
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

  const joinGroup = async () => {
    if (nameExistGroup != textExistGroup?.group?.name) {
      console.log(
        "no te hagas el vivo",
        nameExistGroup,
        textExistGroup?.group?.name
      )
      setTextExistGroup({ ...textExistGroup, exist: false })
      ToastAndroid.show(
        "Nombre incorrecto no te hagas el vivo",
        ToastAndroid.SHORT
      )
      return
    }

    try {
      // zod_checkNameGroup.parse({ nameGroup })
      setLoading(true)

      const response = await fetch(`${API_URL}/joinGroup`, {
        method: "POST",
        headers: {
          // Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: textExistGroup?.group?.id,
          userId: user?.id,
        }),
      })

      const { message } = await response.json()

      if (response?.ok) {
        setLoading(false)
        ToastAndroid.show(message, ToastAndroid.SHORT)
        navigation.navigate("Home")
      } else {
        setLoading(false)
        ToastAndroid.show(message, ToastAndroid.SHORT)
      }
    } catch (error: any) {
      setError(JSON.parse(error?.message)[0]?.message)
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
      {error && <Text className="text-red-500">{error}</Text>}
      <View className="flex flex-row justify-between my-3">
        <TouchableOpacity
          className="border border-green-500 mb-3 py-2 px-2"
          onPress={checkAvailabilityGroup}
        >
          <Text className="text-blue-500">Comprobar disponibilidad</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`border border-green-500 mb-3 py-2 px-2 ${
            !textAvailability?.available && "border-gray-300"
          }`}
          onPress={createGroup}
          disabled={!textAvailability?.available}
        >
          <Text
            className={
              textAvailability?.available ? "text-green-500" : "text-gray-300"
            }
          >
            Crear grupo
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="">Unirse a un grupo existente</Text>
      <TextInput
        onChangeText={(e) => setNameExistGroup(e)}
        // value={data.name}
        placeholder="Ingrese un identificador de grupo"
        className=" p-1 mt-1 rounded-lg bg-gray-50 w-fit"
      />
      {textExistGroup && (
        <Text className={`text-${textExistGroup.color}`}>
          {textExistGroup.text}
        </Text>
      )}
      <View className="flex flex-row justify-between my-3">
        <TouchableOpacity
          className="border border-green-500 mb-3 py-2 px-2"
          onPress={checkExistGroup}
          //   onPress={() => setModalVisible(!modalVisible)}
        >
          <Text className="text-green-500">Comprobar existencia</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`border border-green-500 mb-3 py-2 px-2 ${
            !textExistGroup?.exist && "border-gray-300"
          }`}
          onPress={joinGroup}
          disabled={!textExistGroup?.exist}
        >
          <Text
            className={
              textExistGroup?.exist ? "text-green-500" : "text-gray-300"
            }
          >
            Unirse
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default CreateGroup
