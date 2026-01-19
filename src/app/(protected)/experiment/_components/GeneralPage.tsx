"use client"
import EditIcon from "@mui/icons-material/Edit"
import {
  Alert,
  Button,
  Divider,
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

  const renderContent = () => {
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
        <div>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="h6">Objective</Typography>
            {isEditing === false && (
              <IconButton
                aria-label="edit-objective"
                onClick={() => setIsEditing(true)}
                size="small"
              >
                <EditIcon />
              </IconButton>
            )}
          </Stack>
          {renderContent()}
        </div>
        <Divider />
        <Typography variant="h6">About this experiment</Typography>
        <Grid container spacing={2}>
          <Grid size={2}>
            <Typography variant="body1">Created at</Typography>
          </Grid>
          <Grid size={10}>
            <Typography variant="body1">
              {formatDate(experiment?.data?.createdAt || "-", "MMM dd, yyyy")}
            </Typography>
          </Grid>
          <Grid size={2}>
            <Typography variant="body1">Last updated</Typography>
          </Grid>
          <Grid size={10}>
            <Typography variant="body1">
              {experiment?.data?.updatedAt
                ? formatDate(experiment?.data?.updatedAt, "MMM dd, yyyy")
                : "-"}
            </Typography>
          </Grid>
          <Grid size={2}>
            <Typography variant="body1">Started at</Typography>
          </Grid>
          <Grid size={10}>
            <Typography variant="body1">
              {experiment?.data?.startedAt
                ? formatDate(experiment?.data?.startedAt, "MMM dd, yyyy")
                : "-"}
            </Typography>
          </Grid>
          <Grid size={2}>
            <Typography variant="body1">Completed at</Typography>
          </Grid>
          <Grid size={10}>
            <Typography variant="body1">
              {experiment?.data?.completedAt
                ? formatDate(experiment?.data?.completedAt, "MMM dd, yyyy")
                : "-"}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </>
  )
}

export default GeneralPage
