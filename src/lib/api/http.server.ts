import ky from "ky"
import { cookies } from "next/headers"

export const serverHttp = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  hooks: {
    beforeRequest: [
      async (req) => {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get("auth_session")
        if (sessionCookie) {
          req.headers.set("Cookie", `auth_session=${sessionCookie.value}`)
        }
      }
    ]
    // Open this if we need to debug API error
    // afterResponse: [
    //   async (req, _, res) => {
    //     // DEBUG LOG
    //     if (res.status !== 200) {
    //       const errorBody = await res
    //         .clone()
    //         .json()
    //         .catch(() => ({}))
    //     }
    //   }
    // ]
  }
})
