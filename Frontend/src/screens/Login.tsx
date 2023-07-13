import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  Button,
  ActivityIndicator,
  ToastAndroid,
} from "react-native"
import React, { useLayoutEffect, useState, useContext } from "react"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AuthContext } from "../context/AuthContext"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AuthenticationStackParamList } from "../types"
import { API_URL } from "../../config"

// Mantén tus compras bajo control

type Props = NativeStackScreenProps<AuthenticationStackParamList, "Login">

const Login = ({ navigation }: Props) => {
  const { setIsLogged } = useContext(AuthContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])

  const login = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/login`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const json = await response.json()
      if (response?.ok) {
        console.log("bien", json)
        await AsyncStorage.setItem("userInfo", JSON.stringify(json))

        setIsLogged && setIsLogged(true)
      } else {
        ToastAndroid.show(json.message, ToastAndroid.SHORT)
        setLoading(false)
      }
      // console.log(json)
    } catch (error) {
      ToastAndroid.show(
        "Hubo un error, comuniquese con Lean!",
        ToastAndroid.SHORT
      )
      setLoading(false)
      console.error(error)
    }
  }

  // const fetchData = async () => {
  //   setLoading(true)
  //   try {
  //     const response = await fetch("http://192.168.0.14:3001/purchase")
  //     const json = await response.json()
  //     console.log(json)
  //   } catch (error) {
  //     console.error(error)
  //     setLoading(false)
  //   } finally {
  //     navigation.navigate("Home")
  //   }
  // }

  const toRegister = () => {
    navigation.navigate("Register")
  }

  // const toHome = () => {
  //   // console.log("register")
  //   navigation.navigate("Home")
  // }

  return (
    <SafeAreaView className="bg-white h-full flex items-center justify-start">
      {/* <View className="h-10 bg-slate-700 w-full"></View> */}
      <Image className="w-10/12 h-1/3" source={require("../assets/logo.png")} />
      <View className="w-10/12 h-screen">
        <View className="flex flex-col gap-y-3">
          {/* <Text>Nombre o email</Text> */}
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
          <Button title="Ingresar" onPress={login} />
          <Text className="text-blue-400 text-right" onPress={toRegister}>
            Registrarse
          </Text>
          {loading && <ActivityIndicator />}
        </View>
      </View>
      {/* <Text>Login</Text> */}
    </SafeAreaView>
  )
}

export default Login
