import { redirect } from "next/navigation"
import { serverHttp } from "lib/http.server"
import { getMeApi } from "service/user"
import { hasPermissions } from "utils/permission"
import { PermissionCode } from "../../role/_const/permission"
import State from "components/state"
import UserDetailPageClient from "./UserDetailPage.client"

export default async function UserDetailPageServer() {
  const response = await getMeApi(serverHttp)
  const user = response.success ? response.data : null

  if (!user) {
    redirect("/login")
  }

  if (!hasPermissions(user.permissionCodes, PermissionCode.USER_MANAGE)) {
    return (
      <State.Forbidden description="Only users with permission to manage user can access this page." />
    )
  }

  return <UserDetailPageClient />
}
