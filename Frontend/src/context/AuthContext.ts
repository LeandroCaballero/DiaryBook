import { createContext } from "react"

export const AuthContext = createContext<{
  isLogged?: boolean
  setIsLogged?: (isLogged: boolean) => void
}>({})
