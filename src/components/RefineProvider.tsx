"use client"

import { Refine, ResourceProps } from "@refinedev/core"
import { RefineSnackbarProvider } from "@refinedev/mui"
import routerProvider from "@refinedev/nextjs-router"
import { authProvider } from "providers/auth"

const refineResource: ResourceProps[] = []

interface RefineProviderProps {
  children: React.ReactNode
}

export default function RefineProvider({ children }: RefineProviderProps) {
  return (
    <RefineSnackbarProvider>
      <Refine
        authProvider={authProvider}
        routerProvider={routerProvider}
        resources={refineResource}
        options={{ syncWithLocation: true }}
      >
        {children}
      </Refine>
    </RefineSnackbarProvider>
  )
}
