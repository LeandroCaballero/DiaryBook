import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from "../screens/Home"
import PurchaseDetails from "../screens/PurchaseDetails"
import CreatePurchase from "../screens/CreatePurchase"

const Stack = createNativeStackNavigator()

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Agregar Compra" component={CreatePurchase} />
        <Stack.Screen name="PurchaseDetails" component={PurchaseDetails} />
      </>
    </Stack.Navigator>
  )
}

export default AuthStack
