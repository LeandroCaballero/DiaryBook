import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Login from "../screens/Login"
import Register from "../screens/Register"
import { AuthenticationStackParamList } from "../types/AuthenticationStackParamList"

const Stack = createNativeStackNavigator<AuthenticationStackParamList>()

const AuthenticationStack = () => {
  return (
    <Stack.Navigator>
      <>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </>
    </Stack.Navigator>
  )
}

export default AuthenticationStack
