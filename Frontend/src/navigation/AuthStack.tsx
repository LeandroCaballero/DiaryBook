import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from "../screens/Home"
import PurchaseDetails from "../screens/PurchaseDetails"
import CreatePurchase from "../screens/CreatePurchase"
import CreateGroup from "../screens/CreateGroup"
import Group from "../screens/Group"
import { AuthStackParamList } from "../types/AuthStackParamList"

const Stack = createNativeStackNavigator<AuthStackParamList>()

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          options={({ route }) => ({ title: route.params?.title })}
          name="Group"
          component={Group}
        />
        <Stack.Screen
          options={{ title: "Crear compra" }}
          name="CreatePurchase"
          component={CreatePurchase}
        />
        <Stack.Screen name="PurchaseDetails" component={PurchaseDetails} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
      </>
    </Stack.Navigator>
  )
}

export default AuthStack
