import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Navigation from "./src/navigation/NavigationContainer"
import { AuthProvider } from "./src/context/AuthProvider"

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  )
}
