import State from "components/state"
import { checkPermissionServer } from "services/permission.server"
import { PermissionCode } from "./_const/permission"
import RolePageClient from "./RolePage.client"

const RolePageServer = async () => {
  const result = await checkPermissionServer(
    PermissionCode.PERMISSION_GROUP_MANAGE,
    PermissionCode.PERMISSION_GROUP_VIEW
  )

  if (!result.authorized) {
    return (
      <State.Forbidden description="Only users with permission to view and manage roles can access this page." />
    )
  }

  return <RolePageClient />
}

export default RolePageServer
