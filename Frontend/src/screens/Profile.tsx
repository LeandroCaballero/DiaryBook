import { View, Text, Image, TouchableOpacity, SafeAreaView } from "react-native"
import React, { useContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from "expo-image-picker"
import { API_URL } from "../../config"
import { AuthContext } from "../context/AuthContext"
import { userInfo } from "../types"
import { Cog8ToothIcon } from "react-native-heroicons/outline"
import Toast from "react-native-toast-message"

const Profile = () => {
  const [user, setUser] = useState<userInfo>({
    id: "",
    name: "",
    email: "",
    token: "",
    profileImage: undefined,
  })

  const { setIsLogged } = useContext(AuthContext)

  useEffect(() => {
    AsyncStorage.getItem("userInfo").then((user) =>
      setUser(JSON.parse(user || ""))
    )
  }, [])

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.5,
    })

    // console.log(result)

    if (!result.canceled) {
      let formData = new FormData()

      formData.append("id", user?.id)
      formData.append("photo", {
        uri: result.assets[0].uri,
        name: "photo.jpg",
        type: "image/jpeg",
      })

      try {
        const response = await fetch(`${API_URL}/uploadLogo`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        })

        const json = await response.json()

        setUser({ ...user, profileImage: result.assets[0].uri })

        // console.log("RESPONSE", json)
        Toast.show({
          type: "success",
          text1: "Bien!",
          text2: json.message,
        })
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Hubo un error",
          text2: "Comuniquese con Lean!",
        })

        console.log("ERROR Image", error)
      }
    }
  }

  const loggout = async () => {
    await AsyncStorage.removeItem("userInfo")
    setIsLogged && setIsLogged(false)
  }

  return (
    <SafeAreaView className="p-3 h-full">
      <View className="flex flex-row justify-center mt-2">
        {user?.profileImage ? (
          <TouchableOpacity
            onPress={pickImage}
            className="flex justify-center items-center border rounded-full h-20 w-20"
          >
            <Image
              resizeMode="stretch"
              className="w-full h-full rounded-full"
              source={{
                uri: `${user.profileImage}?t=${Math.floor(Date.now() / 1000)}`,
              }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={pickImage}
            className="flex justify-center items-center border rounded-full h-20 w-20"
          >
            <Text className="uppercase text-5xl">
              {user?.name.substring(0, 1)}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text className="text-center text-xl mt-2">{user?.name}</Text>
      <View className="flex flex-row mt-10 justify-center">
        <TouchableOpacity className="border border-gray-400 rounded-full px-3 py-1 flex flex-row gap-x-1">
          <Cog8ToothIcon size={20} color="#000000" />
          <Text>Configuración</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-blue-400 text-center mt-5" onPress={loggout}>
        Cerrar sesión
      </Text>

      {/* <Text className="text-center text-xl mt-2">{user?.name}</Text>
      <Text className="text-lg ml-2">Datos personales</Text>
      <Text className="mt-2 ml-2">Email: {user?.email}</Text> */}
    </SafeAreaView>
  )
}

export default Profile
