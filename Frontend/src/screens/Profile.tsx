import { View, Text, Image, TouchableOpacity, ToastAndroid } from "react-native"
import React, { useContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from "expo-image-picker"
import { API_URL } from "../../config"
import { AuthContext } from "../context/AuthContext"
import { userInfo } from "../types"

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

        console.log("RESPONSE", json)

        ToastAndroid.show(json.message, ToastAndroid.SHORT)
      } catch (error) {
        ToastAndroid.show(
          "Hubo un error, comuniquese con Lean!",
          ToastAndroid.SHORT
        )
        console.log("ERROR Image", error)
      }
      // console.log("URI", result.assets[0].uri)
    }
  }

  const loggout = async () => {
    await AsyncStorage.removeItem("userInfo")
    setIsLogged && setIsLogged(false)
  }

  return (
    <View>
      <View className="flex flex-row justify-center mt-3">
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
      <Text className="text-center text-lg mt-2">{user?.name}</Text>
      <Text
        className="text-blue-400 bottom-0 text-center mt-5"
        onPress={loggout}
      >
        Cerrar sesión
      </Text>
    </View>
  )
}

export default Profile
