import { View, Text } from "react-native"
import React, { createContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  //   console.log(children)
  const [userInfo, setUserInfo] = useState({})
  //   const [isLoading, setIsLoading] = useState(false)
  const [isLogged, setIsLogged] = useState(false)

  const isLoggedIn = async () => {
    try {
      let userInfo = await AsyncStorage.getItem("userInfo")
      userInfo = JSON.parse(userInfo)

      if (userInfo) {
        const response = await fetch("http://192.168.0.14:3001/status", {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        })

        if (response?.ok) {
          const json = await response.json()
          setUserInfo(json)
          setIsLogged(true)
        } else {
          await AsyncStorage.removeItem("userInfo")
          setIsLogged(false)
        }
      }

      //   setSplashLoading(false)
    } catch (e) {
      //   setSplashLoading(false)
      console.log(`is logged in error ${e}`)
    }
  }

  useEffect(() => {
    // console.log("desde authcontext")
    isLoggedIn()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        isLogged,
        setUserInfo,
        setIsLogged,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
