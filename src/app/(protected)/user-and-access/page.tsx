import { redirect } from "next/navigation"
import { navigationRoutes } from "consts/navigation"

export default function UsersAndAccessPage() {
  redirect(navigationRoutes.userAndAccess.user.list)
}
