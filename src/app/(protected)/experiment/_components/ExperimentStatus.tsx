import CheckIcon from "@mui/icons-material/Check"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import HelpIcon from "@mui/icons-material/Help"
import LightbulbIcon from "@mui/icons-material/Lightbulb"
import NoteAltIcon from "@mui/icons-material/NoteAlt"
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"
import { Tooltip } from "@mui/material"

type ExperimentStatusProps = {
  status: string
}

const ExperimentStatus = ({ status }: ExperimentStatusProps) => {
  switch (status) {
    case "draft":
      return (
        <Tooltip title="Draft" placement="top" arrow>
          <LightbulbIcon color="disabled" fontSize="small" />
        </Tooltip>
      )
    case "planning":
      return (
        <Tooltip title="Planning" placement="top" arrow>
          <NoteAltIcon color="info" fontSize="small" />
        </Tooltip>
      )
    case "running":
      return (
        <Tooltip title="Running" placement="top" arrow>
          <FiberManualRecordIcon color="warning" fontSize="small" />
        </Tooltip>
      )
    case "completed":
      return (
        <Tooltip title="Completed" placement="top" arrow>
          <CheckIcon color="success" fontSize="small" />
        </Tooltip>
      )
    case "cancelled":
      return (
        <Tooltip title="Cancelled" placement="top" arrow>
          <RemoveCircleOutlineIcon color="error" fontSize="small" />
        </Tooltip>
      )
    default:
      return (
        <Tooltip title="Unknown status" placement="top" arrow>
          <HelpIcon color="disabled" fontSize="small" />
        </Tooltip>
      )
  }
}

export default ExperimentStatus
