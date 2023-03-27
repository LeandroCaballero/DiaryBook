import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useContext, useEffect } from "react"
import Home from "./src/screens/Home"
// import Home from "./src/screens/Home"
import Login from "./src/screens/Login"
import Register from "./src/screens/Register"
import PurchaseDetails from "./src/screens/PurchaseDetails"

import { AuthContext, AuthProvider } from "./src/context/AuthContext"

const Stack = createNativeStackNavigator()

export default function App() {
  const context = useContext(AuthContext)
  useEffect(() => {
    // console.log("DALEE", context.isLogged)
  }, [context.isLogged])

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="PurchaseDetails" component={PurchaseDetails} />
          </>
          {/* {context.isLogged ? (
            <Stack.Screen name="Home" component={Home} />
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="Home" component={Home} />
            </>
          )} */}

          {/* <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Register" component={Register} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  )
}
