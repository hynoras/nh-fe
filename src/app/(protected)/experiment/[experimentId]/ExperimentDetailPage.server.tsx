import State from "components/state"
import { checkPermissionServer } from "service/permission.server"
import { PermissionCode } from "../../user-and-access/role/_const/permission"
import ExperimentDetailPageClient from "./ExperimentDetailPage.client"

const ExperimentDetailPageServer = async () => {
  const result = await checkPermissionServer(
    PermissionCode.EXPERIMENT_VIEW,
    PermissionCode.EXPERIMENT_MANAGE
  )

  if (!result.authorized) {
    return (
      <State.Forbidden description="Only users with permission to view and manage experiments can access this page." />
    )
  }

  return <ExperimentDetailPageClient />
}

export default ExperimentDetailPageServer
