import { ApiResponse } from "types/response"

export async function handleRequest<T, R = T>(
  promise: Promise<Response>,
  mapper?: (data: R) => T
): Promise<ApiResponse<T>> {
  try {
    const response = await promise
    const result = await response.json()

    const rawData = result.data

    const isSuccess = result.success ?? true

    if (!isSuccess) {
      throw new Error(result.message || "API request failed")
    }

    return {
      success: true,
      message: result.message || "",
      data: mapper && rawData !== undefined ? mapper(rawData as R) : (rawData as T),
      error: result.error,
      length: result.length
    }
  } catch (error: any) {
    console.error("API Error:", error?.message || error)

    let message = error?.message || "Network error"

    if (error.response) {
      try {
        const errorBody = await error.response.json()
        message = errorBody.message || message
      } catch {}
    }

    throw {
      name: "ApiError",
      message: message,
      response: error.response
    }
  }
}
