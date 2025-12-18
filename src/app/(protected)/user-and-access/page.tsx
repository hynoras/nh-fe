"use client"
import { navigationKeys, navigationRoutes } from "consts/navigation"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const UsersAndAccessPage = () => {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === navigationKeys.userAndAccess) {
      router.push(navigationRoutes.userAndAccess.user.list)
    }
  }, [pathname, router])

  return null
}

export default UsersAndAccessPage
