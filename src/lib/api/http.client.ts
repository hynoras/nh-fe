import Cookies from 'js-cookie'
import ky from "ky"

export const httpClient = ky.create({
  prefixUrl: "/api",
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
