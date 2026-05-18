import State from "components/state"
import { checkPermissionServer } from "lib/auth/permission.server"
import { PermissionCode } from "../../../../domain/permission/permission.entity"
import UserDashboard from "features/user/components/UserDashboard"

const UserPage = async () => {
  const result = await checkPermissionServer(
    PermissionCode.USER_VIEW,
    PermissionCode.USER_MANAGE
  )

  if (!result.authorized) {
    return (
      <State.Forbidden description="Only users with permission to view and manage users can access this page." />
    )
  }

  return <UserDashboard />
}

export default UserPage
