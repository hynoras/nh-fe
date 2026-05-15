import State from "components/state"
import { checkPermissionServer } from "services/permission.server"
import { PermissionCode } from "../../role/_const/permission"
import CreateUserPageClient from "./CreateUserPage.client"

const CreateUserPageServer = async () => {
  const result = await checkPermissionServer(PermissionCode.USER_MANAGE)

  if (!result.authorized) {
    return (
      <State.Forbidden description="Only users with permission to manage users can access this page." />
    )
  }

  return <CreateUserPageClient />
}

export default CreateUserPageServer
