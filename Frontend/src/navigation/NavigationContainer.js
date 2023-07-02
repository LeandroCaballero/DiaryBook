import React from "react"
import { useContext } from "react"
import { NavigationContainer } from "@react-navigation/native"
import AuthStack from "./AuthStack"
import AuthenticationStack from "./AuthenticationStack"
import { AuthContext } from "../context/AuthContext"

const Navigation = () => {
  const { isLogged } = useContext(AuthContext)

  return (
    <NavigationContainer>
      {!isLogged ? <AuthenticationStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default Navigation
