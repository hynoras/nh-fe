import { redirect } from "next/navigation"
import { serverHttp } from "lib/http.server"
import { getMeApi } from "service/user"
import { hasPermissions } from "utils/permission"
import { PermissionCode } from "../_const/permission"
import State from "components/state"
import CreateRolePageClient from "./CreateRolePage.client"

export default async function CreateRolePageServer() {
  const response = await getMeApi(serverHttp)
  const user = response.success ? response.data : null

  if (!user) {
    redirect("/login")
  }

  if (!hasPermissions(user.permissionCodes, PermissionCode.PERMISSION_GROUP_MANAGE)) {
    return (
      <State.Forbidden description="Only users with permission to manage role can access this page." />
    )
  }

  return <CreateRolePageClient />
}
