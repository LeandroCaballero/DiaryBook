import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Button,
  ActivityIndicator,
  ToastAndroid,
} from "react-native"
import React, { useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"

const Register = () => {
  const navigation = useNavigation()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // const createAccount = async () => {
  //   setLoading(true)

  //   fetch("http://192.168.0.14:3001/register", {
  //     method: "POST", // or 'PUT'
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       name,
  //       email,
  //       password,
  //     }),
  //   })
  //     .then((response) => {
  //       // console.log(response)
  //       response.json()
  //       setLoading(false)
  //     })
  //     .then((data) => {
  //       console.log("Success:", data)
  //       setLoading(false)
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error)
  //       setLoading(false)
  //     })
  // }

  const register = async () => {
    try {
      const response = await fetch("http://192.168.0.14:3001/register", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const json = await response.json()
      if (response?.ok) {
        ToastAndroid.show("Registro exitoso, inicie sesión", ToastAndroid.LONG)
        setTimeout(() => navigation.navigate("Login"), 1500)
      } else {
        ToastAndroid.show("El email ya existe!", ToastAndroid.SHORT)
      }
      console.log(json)
    } catch (error) {
      ToastAndroid.show(
        "Hubo un error, comuniquese con Lean!",
        ToastAndroid.SHORT
      )
      console.error(error)
    }
  }

  const getStorage = async () => {
    const value = await AsyncStorage.getItem("@token")
    console.log(value)
  }

  return (
    <SafeAreaView className="bg-white h-full flex items-center justify-start">
      {/* <View className="h-10 bg-slate-700 w-full"></View> */}
      <Image className="w-10/12 h-1/3" source={require("../assets/logo.png")} />
      <View className="w-10/12 h-screen">
        <View className="flex flex-col gap-y-3">
          {/* <Text>Nombre o email</Text> */}
          <TextInput
            className="border-b border-black p-2"
            placeholder="Nombre"
            onChangeText={(e) => {
              setName(e)
            }}
          ></TextInput>
          <TextInput
            className="border-b border-black p-2"
            placeholder="Email"
            onChangeText={(e) => {
              setEmail(e)
            }}
          ></TextInput>
          <TextInput
            className="border-b mb-10 border-black p-2"
            placeholder="Contraseña"
            autoCorrect={false}
            secureTextEntry={true}
            onChangeText={(e) => {
              setPassword(e)
            }}
          ></TextInput>
          <Button title="Registarse" onPress={register} />
          <Button title="Token" onPress={getStorage} />
          {/* <Text className="text-red-800" onPress={() => navigation.goBack()}>
            Iniciar sesión
          </Text> */}
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Register
