import ky from "ky"

export const httpClient = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  credentials: "include"
})
