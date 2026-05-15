import State from "components/state"
import { checkPermissionServer } from "services/permission.server"
import { PermissionCode } from "../_const/permission"
import EditRolePageClient from "./EditRolePage.client"

const EditRolePageServer = async () => {
  const result = await checkPermissionServer(PermissionCode.PERMISSION_GROUP_MANAGE)

  if (!result.authorized) {
    return (
      <State.Forbidden description="Only users with permission to manage roles can access this page." />
    )
  }

  return <EditRolePageClient />
}

export default EditRolePageServer
