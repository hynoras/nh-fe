import State from "components/state"
import { checkPermissionServer } from "lib/auth/permission.server"
import { PermissionCode } from "../../../../../domain/permission/permission.entity"
import CreateRoleDashboard from "features/role/components/CreateRoleDashboard"

const CreateRolePage = async () => {
  const result = await checkPermissionServer(PermissionCode.PERMISSION_GROUP_MANAGE)

  if (!result.authorized) {
    return (
      <State.Forbidden description="Only users with permission to manage roles can access this page." />
    )
  }

  return <CreateRoleDashboard />
}

export default CreateRolePage
