import React, { useState, useEffect, ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AuthContext } from "./AuthContext"
import { API_URL } from "../../config"

interface Props {
  children?: ReactNode
}

interface UserInfo {
  id: number
  name: string
  email: string
  token: string
}

export const AuthProvider = ({ children }: Props) => {
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    isLoggedIn()
  }, [])

  const isLoggedIn = async () => {
    try {
      let userInfo = await AsyncStorage.getItem("userInfo")
      let userInfoJson: UserInfo = JSON.parse(userInfo || "")

      if (userInfo) {
        const response = await fetch(`${API_URL}/status`, {
          headers: {
            Authorization: `Bearer ${userInfoJson.token}`,
          },
        })

        if (response?.ok) {
          const json = await response.json()
          console.log(json)
          setIsLogged(true)
        } else {
          await AsyncStorage.removeItem("userInfo")
          setIsLogged(false)
        }
      }
    } catch (e) {
      console.log(`is logged in error ${e}`)
    }
  }

  return (
    <AuthContext.Provider value={{ isLogged, setIsLogged }}>
      {children}
    </AuthContext.Provider>
  )
}
