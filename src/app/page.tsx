import { checkPermissionServer } from "lib/auth/permission.server"
import { redirect } from "next/navigation"

export default async function IndexPage() {
  const { authorized } = await checkPermissionServer()

  if (authorized) {
    redirect("/home")
  }

  redirect("/login")
}
