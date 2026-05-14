import State from "components/state"
import { checkPermissionServer } from "service/permission.server"
import { PermissionCode } from "../_const/permission"
import CreateRolePageClient from "./CreateRolePage.client"

const CreateRolePageServer = async () => {
  const result = await checkPermissionServer(PermissionCode.PERMISSION_GROUP_MANAGE)

  if (!result.authorized) {
    return (
      <State.Forbidden description="Only users with permission to manage roles can access this page." />
    )
  }

  return <CreateRolePageClient />
}

export default CreateRolePageServer
