import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Navigation from "./src/navigation/NavigationContainer"
import { AuthProvider } from "./src/context/AuthProvider"
import { Toast } from "react-native-toast-message/lib/src/Toast"

export default function App() {
  return (
    <>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
      <Toast />
    </>
  )
}
