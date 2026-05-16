import { ApiResponse } from "types/response"

export async function handleRequest<T, R = T>(
  promise: Promise<Response>,
  mapper?: (data: R) => T
): Promise<ApiResponse<T>> {
  try {
    const response = await promise
    const result = await response.json()

    const rawData = result.data

    return {
      success: result.success ?? true,
      message: result.message || "",
      data: mapper && rawData !== undefined ? mapper(rawData as R) : (rawData as T),
      error: result.error,
      length: result.length
    }
  } catch (error: any) {
    console.error("API Error:", error?.message || error)

    let message = error?.message || "Network error"
    let detail = error

    if (error.response) {
      try {
        const errorBody = await error.response.json()
        message = errorBody.message || message
        detail = errorBody.error || errorBody
      } catch {}
    }

    return { success: false, message, error: detail }
  }
}
