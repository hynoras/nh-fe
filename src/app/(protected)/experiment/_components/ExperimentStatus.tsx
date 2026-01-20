import CheckIcon from "@mui/icons-material/Check"
import Circle from "@mui/icons-material/Circle"
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import LightbulbIcon from "@mui/icons-material/Lightbulb"
import { Chip, Tooltip } from "@mui/material"

type ExperimentStatusProps = {
  status: string
  isChip?: boolean
  size?: "small" | "medium"
}

const ExperimentStatus = ({
  status,
  isChip = false,
  size = "small"
}: ExperimentStatusProps) => {
  const renderStatusElement = (
    status: string
  ): {
    color: "default" | "info" | "warning" | "success" | "error"
    icon: React.ReactElement
  } => {
    switch (status) {
      case "draft":
        return {
          color: "default",
          icon: <LightbulbIcon fontSize="small" />
        }
      case "planning":
        return {
          color: "info",
          icon: <FiberManualRecordIcon fontSize="small" />
        }
      case "running":
        return {
          color: "warning",
          icon: <Circle fontSize="small" />
        }
      case "completed":
        return {
          color: "success",
          icon: <CheckIcon fontSize="small" />
        }
      case "cancelled":
        return {
          color: "error",
          icon: <DoDisturbOnIcon fontSize="small" />
        }
      default:
        return {
          color: "default",
          icon: <LightbulbIcon fontSize="small" />
        }
    }
  }
  return isChip ? (
    <Chip
      icon={renderStatusElement(status).icon}
      label={status}
      color={renderStatusElement(status).color}
      size={size}
      variant="outlined"
    />
  ) : (
    <Tooltip title={status} placement="top" arrow>
      {renderStatusElement(status).icon}
    </Tooltip>
  )
}

export default ExperimentStatus
