import { AuthProvider } from "@refinedev/core"
import { LoginDto } from "app/login/_domain/dto/login"
import { loginApi, logoutApi } from "app/login/_service"

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    let loginDto: LoginDto = {
      email: username,
      password: password
    }
    const response = await loginApi(loginDto)
    if (response.success) {
      return {
        success: true,
        redirectTo: "/"
      }
    }
    return {
      success: false,
      error: new Error(response.message || "Login failed")
    }
  },
  logout: async () => {
    const response = await logoutApi()
    if (response.success) {
      return {
        success: true,
        redirectTo: "/login"
      }
    }
    return {
      success: false,
      error: new Error(response.message || "Logout failed")
    }
  },
  check: async () => {
    return {
      authenticated: true
    }
  },
  onError: async (error) => {
    console.error(error)
    return { error }
  }
}
