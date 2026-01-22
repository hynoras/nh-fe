import { ExperimentStatus } from "../_domain/entity/experiment"
import { StatusTransitionMetadata } from "../_types/experiment"

export const statusMetadata: Record<ExperimentStatus, StatusTransitionMetadata> = {
  [ExperimentStatus.DRAFT]: {
    buttonText: "Save draft",
    notification: {
      title: "Save draft this experiment?",
      message: `Saving a draft experiment indicates that execution has finished and the experimental record is finalized.\n
                    From this point onward, the experiment is treated as a scientific record rather than an active workspace.`
    }
  },
  [ExperimentStatus.PLANNING]: {
    buttonText: "Start planning",
    notification: {
      title: "Start planning this experiment?",
      message: `Planning marks the point where intent becomes more structured.\n
              Some fields will be restricted to ensure consistency as the experiment moves forward.`
    }
  },
  [ExperimentStatus.RUNNING]: {
    buttonText: "Run experiment",
    notification: {
      title: "Run this experiment?",
      message: `Running an experiment creates a scientific record.\n
              From this point, changes are limited to ensure the experiment reflects what actually happened.`
    }
  },
  [ExperimentStatus.COMPLETED]: {
    buttonText: "Mark as completed",
    notification: {
      title: "Complete this experiment?",
      message: `Completing an experiment indicates that execution has finished and the experimental record is finalized.\n
              From this point onward, the experiment is treated as a scientific record rather than an active workspace.`
    }
  },
  [ExperimentStatus.ABORTED]: {
    buttonText: "Abort experiment",
    notification: {
      title: "Abort this experiment?",
      message: `Aborting an experiment indicates that execution has finished and the experimental record is finalized.\n
              From this point onward, the experiment is treated as a scientific record rather than an active workspace.`
    }
  }
}
