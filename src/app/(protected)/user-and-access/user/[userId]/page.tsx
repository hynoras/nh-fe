import State from "components/state"
import { checkPermissionServer } from "lib/auth/permission.server"
import { PermissionCode } from "../../../../../domain/permission/permission.entity"
import UserDetailDashboard from "features/user/components/UserDetailDashboard"

const UserDetailPage = async () => {
  const result = await checkPermissionServer(PermissionCode.USER_MANAGE)

  if (!result.authorized) {
    return (
      <State.Forbidden description="Only users with permission to manage users can access this page." />
    )
  }

  return <UserDetailDashboard />
}

export default UserDetailPage
