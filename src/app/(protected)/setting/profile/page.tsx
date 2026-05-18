import { checkPermissionServer } from "lib/auth/permission.server"
import { redirect } from "next/navigation"

const ProfilePage = async () => {
  const result = await checkPermissionServer()

  if (!result.authorized) {
    redirect("/login")
  }

  return <div>Profile</div>
}

export default ProfilePage
