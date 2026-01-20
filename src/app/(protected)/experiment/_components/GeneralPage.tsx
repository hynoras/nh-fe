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
  Snackbar,
  Stack,
  Typography
} from "@mui/material"
import Grid from "@mui/material/Grid2"
import { formatDate } from "date-fns"
import { useExperimentDetail, useUpdateExperiment } from "hooks/queries/experiment"
import { useParams } from "next/navigation"
import { useState } from "react"
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui"
import { UpdateExperimentDto } from "../_domain/dto/experiment"

const GeneralPage = () => {
  const params = useParams<{ experimentId: string }>()
  const experimentId = params.experimentId
  const { data: experiment, isLoading } = useExperimentDetail(experimentId)

  const formContext = useForm<UpdateExperimentDto>({
    defaultValues: {
      objective: experiment?.data?.objective
    }
  })

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState<{
    type: "success" | "error"
    message: string
  }>({ type: "success", message: "" })

  const updateExperimentMutation = useUpdateExperiment(experimentId)

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
          message: "Experiment updated successfully"
        })
        setSnackbarOpen(true)
      },
      onError: (error: any) => {
        setSnackbarMessage({
          type: "error",
          message: error.message || "Failed to update experiment"
        })
        setSnackbarOpen(true)
      }
    })
  }

  const renderObjectiveContent = () => {
    if (isEditing === false) {
      return <Typography>{experiment?.data?.objective}</Typography>
    }

    if (isEditing === true) {
      return (
        <FormContainer
          formContext={formContext}
          handleSubmit={formContext.handleSubmit(handleUpdateExperiment)}
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
      <Stack direction="column" justifyContent="flex-start" spacing={2}>
        {/* Objective */}
        <Grid container spacing={2}>
          <Grid size={7}>
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
              <CardContent>{renderObjectiveContent()}</CardContent>
            </Card>
          </Grid>

          {/* Timeline */}
          <Grid size={2}>
            <Card variant="outlined" className="h-[100%]">
              <CardHeader
                avatar={<CalendarMonthIcon aria-label="timeline" />}
                title="Timeline"
              />
              <CardContent>
                <Stack direction="column" justifyContent="flex-start" spacing={2}>
                  <div>
                    <Typography variant="body1" fontWeight="bold">
                      Start date
                    </Typography>
                    <Typography variant="body2">
                      {experiment?.data?.createdAt
                        ? formatDate(experiment?.data?.createdAt, "MMM dd, yyyy")
                        : "-"}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body1" fontWeight="bold">
                      End date
                    </Typography>
                    <Typography variant="body2">
                      {experiment?.data?.completedAt
                        ? formatDate(experiment?.data?.completedAt, "MMM dd, yyyy")
                        : "-"}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body1" fontWeight="bold">
                      Last update
                    </Typography>
                    <Typography variant="body2">
                      {experiment?.data?.updatedAt
                        ? formatDate(experiment?.data?.updatedAt, "MMM dd, yyyy")
                        : "-"}
                    </Typography>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Experiment Type */}
          <Grid size={3}>
            <Card className="h-[100%] flex flex-col" variant="outlined">
              <CardHeader
                avatar={<CategoryIcon aria-label="type" />}
                title="Experiment Type"
              />
              <CardContent>
                <Typography variant="h5" fontWeight="bold" textTransform="capitalize">
                  {experiment?.data?.type}
                </Typography>
              </CardContent>
              <CardActions className="mt-auto">
                <Button className="normal-case" variant="text" size="medium">
                  {`Change to ${experiment?.data?.type === "exploratory" ? "confirmatory" : "exploratory"}`}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </>
  )
}

export default GeneralPage
