import State from "components/state"
import { checkPermissionServer } from "lib/auth/permission.server"
import { PermissionCode } from "../../../../domain/permission/permission.entity"
import ExperimentDetailDashboard from "features/experiment/components/ExperimentDetailDashboard"

const ExperimentDetailPage = async () => {
  const result = await checkPermissionServer(
    PermissionCode.EXPERIMENT_VIEW,
    PermissionCode.EXPERIMENT_MANAGE
  )

  if (!result.authorized) {
    return (
      <State.Forbidden description="Only users with permission to view and manage experiments can access this page." />
    )
  }

  return <ExperimentDetailDashboard />
}

export default ExperimentDetailPage
