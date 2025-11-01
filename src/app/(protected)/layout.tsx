"use client"

import { Authenticated } from "@refinedev/core"
import Header from "components/Header"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Authenticated key="authenticated-routes">
      <Header />
      {children}
    </Authenticated>
  )
}
