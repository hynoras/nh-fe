import { AuthProvider } from "@refinedev/core"
import { LoginDto } from "app/login/_domain/dto/login"
import { loginApi, logoutApi } from "services/auth"
import { getMeApi } from "services/user"

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    let loginDto: LoginDto = {
      email: username,
      password: password
    }
    try {
      await loginApi(loginDto)
      return {
        success: true,
        redirectTo: "/"
      }
    } catch (error: any) {
      return {
        success: false,
        error: new Error(error.message || "Login failed")
      }
    }
  },
  logout: async () => {
    try {
      await logoutApi()
      return {
        success: true,
        redirectTo: "/login"
      }
    } catch (error: any) {
      return {
        success: false,
        error: new Error(error.message || "Logout failed")
      }
    }
  },
  check: async () => {
    try {
      await getMeApi()
      return {
        authenticated: true,
        logout: false
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
  getIdentity: async () => {
    try {
      const response = await getMeApi()
      return response.data
    } catch {
      return null
    }
  },
  onError: async (error) => {
    console.error(error)
    return { error }
  }
}
