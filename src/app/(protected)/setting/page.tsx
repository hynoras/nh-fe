"use client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const SettingPage = () => {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Redirect to profile page when accessing /setting directly
    if (pathname === "/setting") {
      router.push("/setting/profile")
    }
  }, [pathname, router])

  return null
}

export default SettingPage
