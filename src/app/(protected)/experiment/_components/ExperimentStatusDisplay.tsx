import CheckIcon from "@mui/icons-material/Check"
import Circle from "@mui/icons-material/Circle"
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn"
import LightbulbIcon from "@mui/icons-material/Lightbulb"
import NoteAltIcon from "@mui/icons-material/NoteAlt"
import { Chip, Tooltip } from "@mui/material"
import { ExperimentStatus } from "../_domain/entity/experiment"

type ExperimentStatusDisplayProps = {
  status: ExperimentStatus
  isChip?: boolean
  size?: "small" | "medium"
}

const ExperimentStatusDisplay = ({
  status,
  isChip = false,
  size = "small"
}: ExperimentStatusDisplayProps) => {
  const renderStatusElement = (
    status: ExperimentStatus
  ): {
    color: "default" | "info" | "warning" | "success" | "error"
    icon: React.ReactElement
  } => {
    switch (status) {
      case ExperimentStatus.DRAFT:
        return {
          color: "default",
          icon: <LightbulbIcon fontSize="small" color="disabled" />
        }
      case ExperimentStatus.PLANNING:
        return {
          color: "info",
          icon: <NoteAltIcon fontSize="small" color="info" />
        }
      case ExperimentStatus.RUNNING:
        return {
          color: "warning",
          icon: <Circle fontSize="small" color="warning" />
        }
      case ExperimentStatus.COMPLETED:
        return {
          color: "success",
          icon: <CheckIcon fontSize="small" color="success" />
        }
      case ExperimentStatus.ABORTED:
        return {
          color: "error",
          icon: <DoDisturbOnIcon fontSize="small" color="error" />
        }
      default:
        return {
          color: "default",
          icon: <LightbulbIcon fontSize="small" color="disabled" />
        }
    }
  }
  return isChip ? (
    <Chip
      className="capitalize"
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

export default ExperimentStatusDisplay
