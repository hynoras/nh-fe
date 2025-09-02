import { IResponse } from "types/response"

export const createResponse = (
  message: string,
  data: any,
  success: boolean
): IResponse => {
  return {
    success,
    message,
    data
  }
}
