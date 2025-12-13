import { AuthProvider } from "@refinedev/core"
import { LoginDto } from "app/login/_domain/dto/login"
import { loginApi, logoutApi } from "app/login/_service"
import { getMeApi } from "service/user"

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
    try {
      const response = await getMeApi()

      if (response.success) {
        return {
          authenticated: true,
          logout: false
        }
      }
      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true
      }
    } catch (error) {
      console.error("Auth check error:", error)
      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true
      }
    }
  },
  onError: async (error) => {
    console.error(error)
    return { error }
  }
}
