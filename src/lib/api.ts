import ky from "ky"
import { ApiResponse } from "types/response"

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  credentials: "include",
  hooks: {
    beforeRequest: [
      (req) => {
        // Example: attach auth token if exists
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        if (token) req.headers.set("Authorization", `Bearer ${token}`)
      }
    ]
  }
})

// Generic helper for cleaner try/catch with optional mapper
export async function handleRequest<T, R = T>(
  promise: Promise<Response>
): Promise<ApiResponse<T>>

export async function handleRequest<T, R = T>(
  promise: Promise<Response>,
  mapper: (data: R) => T
): Promise<ApiResponse<T>>

export async function handleRequest<T, R = T>(
  promise: Promise<Response>,
  mapper: (data: R) => T,
  custom: {
    success: any
    failure: any
  }
): Promise<any>

export async function handleRequest<T, R = T>(
  promise: Promise<Response>,
  mapper?: (data: R) => T,
  custom?: {
    success: any
    failure: any
  }
): Promise<ApiResponse<T> | any> {
  try {
    const response = await promise
    const result = await response.json()

    const data = result.data !== undefined ? result.data : result

    let mappedData: T
    if (mapper) {
      if (Array.isArray(data)) {
        // Pass the entire array to the mapper - let the mapper handle array mapping
        mappedData = mapper(data as R) as T
      } else if (data !== null && typeof data === "object") {
        mappedData = mapper(data as R)
      } else {
        mappedData = mapper(data as R)
      }
    } else {
      mappedData = data
    }

    if (custom?.success !== undefined) {
      return custom.success
    }

    if (result.length !== undefined && result.length > 0) {
      return {
        success: result.success !== undefined ? result.success : true,
        message: result.message || "Request successful",
        data: mappedData,
        length: result.length
      }
    } else {
      return {
        success: result.success !== undefined ? result.success : true,
        message: result.message || "Request successful",
        data: mappedData
      }
    }
  } catch (error: any) {
    console.error("API Error:", error?.message || error)

    if (custom?.failure !== undefined) {
      return custom.failure
    }

    // Try to extract error and message from server response
    let serverMessage = error?.message || "Network error"
    let serverError = error?.message || "Network error"

    if (error?.response) {
      try {
        const errorResponse = await error.response.json()
        if (errorResponse.message) {
          serverMessage = errorResponse.message
        }
        if (errorResponse.error) {
          serverError = errorResponse.error
        } else if (errorResponse.message) {
          serverError = errorResponse.message
        }
      } catch (parseError) {
        // If parsing fails, use the original error message
      }
    }

    return {
      success: false,
      message: serverMessage,
      error: serverError
    }
  }
}

export default api
