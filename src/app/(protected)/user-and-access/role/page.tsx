import State from "components/state"
import { checkPermissionServer } from "lib/auth/permission.server"
import { PermissionCode } from "../../../../domain/permission/permission.entity"
import RoleDashboard from "features/role/components/RoleDashboard"

const RolePage = async () => {
  const result = await checkPermissionServer(
    PermissionCode.PERMISSION_GROUP_MANAGE,
    PermissionCode.PERMISSION_GROUP_VIEW
  )

  if (!result.authorized) {
    return (
      <State.Forbidden description="Only users with permission to view and manage roles can access this page." />
    )
  }

  return <RoleDashboard />
}

export default RolePage
