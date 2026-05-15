import { redirect } from "next/navigation"
import { checkPermissionServer } from "services/permission.server"

export default async function IndexPage() {
  const { authorized } = await checkPermissionServer()

  if (authorized) {
    redirect("/home")
  }

  redirect("/login")
}
