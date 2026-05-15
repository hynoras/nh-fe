import { redirect } from "next/navigation"
import { checkPermissionServer } from "services/permission.server"

const ProfilePage = async () => {
  const result = await checkPermissionServer()

  if (!result.authorized) {
    redirect("/login")
  }

  return <div>Profile</div>
}

export default ProfilePage
