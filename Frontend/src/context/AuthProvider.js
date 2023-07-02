import React, { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AuthContext } from "./AuthContext"

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState()
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    isLoggedIn()
  }, [])

  const isLoggedIn = async () => {
    try {
      let userInfo = await AsyncStorage.getItem("userInfo")
      userInfo = JSON.parse(userInfo)
      console.log(userInfo)

      if (userInfo) {
        const response = await fetch("http://192.168.0.14:3001/status", {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        })

        if (response?.ok) {
          const json = await response.json()
          console.log(json)
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

  return (
    <AuthContext.Provider value={{ isLogged }}>{children}</AuthContext.Provider>
  )
}
