"use client"

import { Authenticated } from "@refinedev/core"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <Authenticated key="authenticated-routes">{children}</Authenticated>
}
