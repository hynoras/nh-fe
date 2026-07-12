import Cookies from 'js-cookie'
import ky from "ky"

export const httpClient = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  credentials: "include",
  hooks: {
    beforeRequest: [
      (request) => {
        const csrfToken = Cookies.get('csrf_token')
        if (csrfToken) {
          request.headers.set('X-CSRF-Token', csrfToken)
        }
      }
    ]
  }
})
