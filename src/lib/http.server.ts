import ky from "ky"
import { cookies } from "next/headers"

export const serverHttp = ky.create({
  prefixUrl: process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL,
  hooks: {
    beforeRequest: [
      async (req) => {
        const cookieStore = await cookies()
        req.headers.set("Cookie", cookieStore.toString())
      }
    ]
  }
})
