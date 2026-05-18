import State from "components/state"
import { checkPermissionServer } from "lib/auth/permission.server"
import { PermissionCode } from "../../../../../domain/permission/permission.entity"
import EditRoleDashboard from "features/role/components/EditRoleDashboard"

const EditRolePage = async () => {
  const result = await checkPermissionServer(PermissionCode.PERMISSION_GROUP_MANAGE)

  if (!result.authorized) {
    return (
      <State.Forbidden description="Only users with permission to manage roles can access this page." />
    )
  }

  return <EditRoleDashboard />
}

export default EditRolePage
