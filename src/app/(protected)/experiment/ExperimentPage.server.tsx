import { redirect } from "next/navigation"
import { serverHttp } from "lib/http.server"
import { getMeApi } from "service/user"
import { hasPermissions } from "utils/permission"
import { PermissionCode } from "../user-and-access/role/_const/permission"
import State from "components/state"
import ExperimentPageClient from "./ExperimentPage.client"

export default async function ExperimentPageServer() {
  const response = await getMeApi(serverHttp)
  const user = response.success ? response.data : null

  if (!user) {
    redirect("/login")
  }

  if (
    !hasPermissions(
      user.permissionCodes,
      PermissionCode.EXPERIMENT_VIEW,
      PermissionCode.EXPERIMENT_MANAGE
    )
  ) {
    return (
      <State.Forbidden description="Only users with permission to view and manage experiment can access this page." />
    )
  }

  return <ExperimentPageClient />
}
