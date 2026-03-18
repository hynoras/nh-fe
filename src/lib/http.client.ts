import ky from "ky"

export const clientHttp = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  credentials: "include"
})
