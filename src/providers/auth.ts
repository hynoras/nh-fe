import { AuthProvider } from "@refinedev/core"
import { getMeApi } from "app/(protected)/user/_service"
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
    try {
      console.log("🔒 Auth check: Calling /users/me API...")
      const response = await getMeApi()
      console.log("🔒 Auth check response:", response)

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
      console.error("🔒 Auth check error:", error)
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
