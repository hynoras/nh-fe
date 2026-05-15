"use client"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import CategoryIcon from "@mui/icons-material/Category"
import EditIcon from "@mui/icons-material/Edit"
import FlagIcon from "@mui/icons-material/Flag"
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Link,
  Skeleton,
  Snackbar,
  Stack,
  Tooltip,
  Typography
} from "@mui/material"
import Grid from "@mui/material/Grid2"
import { formatDate } from "date-fns"
import { useExperimentDetail, useUpdateExperiment } from "hooks/queries/experiment"
import { useParams } from "next/navigation"
import { useState } from "react"
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui"
import { UpdateExperimentDto } from "../_domain/dto/experiment"
import { Experiment } from "../_domain/entity/experiment"

const ExperimentObjectiveCard = ({
  experiment,
  isLoading
}: {
  experiment: Experiment | undefined
  isLoading?: boolean
}) => {
  const params = useParams<{ experimentId: string }>()
  const experimentId = params.experimentId

  const updateExperimentMutation = useUpdateExperiment(experimentId)

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState<{
    type: "success" | "error"
    message: string
  }>({ type: "success", message: "" })

  const objectiveFormContext = useForm<UpdateExperimentDto>({
    defaultValues: {
      objective: experiment?.objective
    }
  })

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
    setSnackbarMessage({ type: "success", message: "" })
  }

  const handleUpdateExperiment = (data: UpdateExperimentDto) => {
    updateExperimentMutation.mutate(data, {
      onSuccess: () => {
        setIsEditing(false)
        setSnackbarMessage({
          type: "success",
          message: "Experiment objective updated successfully"
        })
        setSnackbarOpen(true)
      },
      onError: (error: any) => {
        setSnackbarMessage({
          type: "error",
          message: error.message || "Failed to update experiment objective"
        })
        setSnackbarOpen(true)
      }
    })
  }

  const renderContent = () => {
    if (isEditing === false) {
      return <Typography>{experiment?.objective}</Typography>
    }

    if (isEditing === true) {
      return (
        <FormContainer
          formContext={objectiveFormContext}
          handleSubmit={objectiveFormContext.handleSubmit(handleUpdateExperiment)}
        >
          <Stack direction="column" justifyContent="flex-start" spacing={2}>
            <TextFieldElement
              id="objective"
              type="text"
              name="objective"
              placeholder="Experiment objective"
              required
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              size="small"
            />
            <Stack direction="row" justifyContent="flex-start" spacing={1}>
              <Button
                type="submit"
                variant="contained"
                size="small"
                disabled={updateExperimentMutation.isPending}
                loading={updateExperimentMutation.isPending}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsEditing(false)}
                disabled={updateExperimentMutation.isPending}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </FormContainer>
      )
    }
  }

  if (isLoading) {
    return (
      <Card className="h-[100%]" variant="outlined">
        <CardHeader avatar={<FlagIcon aria-label="recipe" />} title="Objective" />
        <CardContent>
          <Stack spacing={1}>
            <Skeleton variant="text" width="100%" height={24} />
            <Skeleton variant="text" width="95%" height={24} />
            <Skeleton variant="text" width="98%" height={24} />
            <Skeleton variant="text" width="90%" height={24} />
            <Skeleton variant="text" width="85%" height={24} />
          </Stack>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarMessage.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage.message}
        </Alert>
      </Snackbar>
      <Card className="h-[100%]" variant="outlined">
        <CardHeader
          avatar={<FlagIcon aria-label="recipe" />}
          action={
            isEditing === false ? (
              <IconButton
                aria-label="edit-objective"
                onClick={() => setIsEditing(true)}
                size="small"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            ) : null
          }
          title="Objective"
        />
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </>
  )
}

const ExperimentTypeCard = ({
  experiment,
  isLoading
}: {
  experiment: Experiment | undefined
  isLoading?: boolean
}) => {
  const params = useParams<{ experimentId: string }>()
  const experimentId = params.experimentId

  const updateExperimentMutation = useUpdateExperiment(experimentId)

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState<{
    type: "success" | "error"
    message: string
  }>({ type: "success", message: "" })

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
    setSnackbarMessage({ type: "success", message: "" })
  }

  const handleUpdateExperiment = (data: UpdateExperimentDto) => {
    updateExperimentMutation.mutate(data, {
      onSuccess: () => {
        setIsEditing(false)
        setSnackbarMessage({
          type: "success",
          message: `Experiment type changed to ${data.type} successfully`
        })
        setSnackbarOpen(true)
      },
      onError: (error: any) => {
        setSnackbarMessage({
          type: "error",
          message: error.message || "Failed to change experiment type"
        })
        setSnackbarOpen(true)
      }
    })
  }

  const renderNotification = (type: string) => {
    switch (type) {
      case "exploratory":
        return `Confirmatory experiments require predefined objectives and hypotheses, 
          and are typically analyzed against prior assumptions. 
          This may affect how results are interpreted later.`

      case "confirmatory":
        return `Exploratory experiments allow flexible objectives and post-hoc analysis. 
          Results are interpreted descriptively rather than against predefined hypotheses.`

      default:
        return ""
    }
  }

  const renderContent = () => {
    if (isEditing === false) {
      return (
        <>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" textTransform="capitalize">
              {experiment?.type}
            </Typography>
          </CardContent>
          <CardActions className="mt-auto">
            <Button
              className="normal-case"
              variant="text"
              size="medium"
              onClick={() => setIsEditing(true)}
            >
              {`Change to ${experiment?.type === "exploratory" ? "confirmatory" : "exploratory"}`}
            </Button>
          </CardActions>
        </>
      )
    }
    if (isEditing === true) {
      return (
        <>
          <CardContent>
            <Stack direction="column" justifyContent="flex-start" spacing={1}>
              <Stack direction="row" justifyContent="flex-start" spacing={0.5}>
                <Typography variant="body1">Changing experiment type to</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {experiment?.type === "exploratory" ? "confirmatory" : "exploratory"}
                </Typography>
                {`.`}
              </Stack>
              <Typography variant="body1">
                This affects how objectives, hypotheses, and results are interpreted.
              </Typography>
              <Tooltip title={renderNotification(experiment?.type || "")}>
                <Link variant="body2">What does this mean?</Link>
              </Tooltip>
            </Stack>
          </CardContent>
          <CardActions className="mt-auto">
            <Stack direction="row" justifyContent="flex-start" spacing={1}>
              <Button
                variant="contained"
                size="small"
                disabled={updateExperimentMutation.isPending}
                loading={updateExperimentMutation.isPending}
                onClick={() =>
                  handleUpdateExperiment({
                    type:
                      experiment?.type === "exploratory" ? "confirmatory" : "exploratory"
                  })
                }
              >
                Confirm
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsEditing(false)}
                disabled={updateExperimentMutation.isPending}
              >
                Cancel
              </Button>
            </Stack>
          </CardActions>
        </>
      )
    }
    return (
      <Typography variant="body2" textTransform="capitalize">
        {experiment?.type}
      </Typography>
    )
  }

  if (isLoading) {
    return (
      <Card className="h-[100%] flex flex-col" variant="outlined">
        <CardHeader avatar={<CategoryIcon aria-label="type" />} title="Experiment Type" />
        <CardContent>
          <Skeleton variant="text" width="60%" height={40} />
        </CardContent>
        <CardActions className="mt-auto">
          <Skeleton variant="rectangular" width={200} height={36} />
        </CardActions>
      </Card>
    )
  }

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarMessage.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage.message}
        </Alert>
      </Snackbar>
      <Card className="h-[100%] flex flex-col" variant="outlined">
        <CardHeader avatar={<CategoryIcon aria-label="type" />} title="Experiment Type" />
        {renderContent()}
      </Card>
    </>
  )
}

const ExperimentTimelineCard = ({
  experiment,
  isLoading
}: {
  experiment: Experiment | undefined
  isLoading?: boolean
}) => {
  if (isLoading) {
    return (
      <Card variant="outlined" className="h-[100%]">
        <CardHeader
          avatar={<CalendarMonthIcon aria-label="timeline" />}
          title="Timeline"
        />
        <CardContent>
          <Stack direction="column" justifyContent="flex-start" spacing={2}>
            <div>
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="text" width="60%" height={20} />
            </div>
            <div>
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="text" width="60%" height={20} />
            </div>
            <div>
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="text" width="60%" height={20} />
            </div>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="outlined" className="h-[100%]">
      <CardHeader avatar={<CalendarMonthIcon aria-label="timeline" />} title="Timeline" />
      <CardContent>
        <Stack direction="column" justifyContent="flex-start" spacing={2}>
          <div>
            <Typography variant="body1" fontWeight="bold">
              Start date
            </Typography>
            <Typography variant="body2">
              {experiment?.createdAt
                ? formatDate(experiment?.createdAt, "MMM dd, yyyy")
                : "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="body1" fontWeight="bold">
              End date
            </Typography>
            <Typography variant="body2">
              {experiment?.completedAt
                ? formatDate(experiment?.completedAt, "MMM dd, yyyy")
                : "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="body1" fontWeight="bold">
              Last update
            </Typography>
            <Typography variant="body2">
              {experiment?.updatedAt
                ? formatDate(experiment?.updatedAt, "MMM dd, yyyy")
                : "-"}
            </Typography>
          </div>
        </Stack>
      </CardContent>
    </Card>
  )
}

const GeneralPage = () => {
  const params = useParams<{ experimentId: string }>()
  const experimentId = params.experimentId
  const { data: experiment, isLoading } = useExperimentDetail(experimentId)

  return (
    <Stack direction="column" justifyContent="flex-start" spacing={2}>
      <Grid container spacing={2}>
        {/* Objective */}
        <Grid size={6}>
          <ExperimentObjectiveCard experiment={experiment?.data} isLoading={isLoading} />
        </Grid>

        {/* Timeline */}
        <Grid size={2}>
          <ExperimentTimelineCard experiment={experiment?.data} isLoading={isLoading} />
        </Grid>

        {/* Experiment Type */}
        <Grid size={4}>
          <ExperimentTypeCard experiment={experiment?.data} isLoading={isLoading} />
        </Grid>
      </Grid>
    </Stack>
  )
}

export default GeneralPage
