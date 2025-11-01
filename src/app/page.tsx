"use client"

import { useIsAuthenticated } from "@refinedev/core"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function IndexPage() {
  const { data, isLoading } = useIsAuthenticated()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (data?.authenticated) {
        router.push("/user")
      } else {
        router.push("/login")
      }
    }
  }, [data, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
