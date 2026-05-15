import State from "components/state"
import { checkPermissionServer } from "services/permission.server"
import { PermissionCode } from "../role/_const/permission"
import UserPageClient from "./UserPage.client"

const UserPageServer = async () => {
  const result = await checkPermissionServer(
    PermissionCode.USER_VIEW,
    PermissionCode.USER_MANAGE
  )

  if (!result.authorized) {
    return (
      <State.Forbidden description="Only users with permission to view and manage users can access this page." />
    )
  }

  return <UserPageClient />
}

export default UserPageServer
