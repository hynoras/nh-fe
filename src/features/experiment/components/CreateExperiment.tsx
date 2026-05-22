"use client"

import AddIcon from "@mui/icons-material/Add"
import {
  Alert,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  Typography
} from "@mui/material"
import Grid from "@mui/material/Grid2"
import { useNotification } from "hooks/notification"
import { useCreateExperiment } from "hooks/queries/experiment"
import { useEffect, useMemo, useState } from "react"
import {
  FormContainer,
  RadioButtonGroup,
  TextFieldElement,
  useForm
} from "react-hook-form-mui"
import { useModalStore } from "stores/modal"
import { CreateExperimentDto } from "../../../domain/experiment/experiment.dto"

const CreateExperiment = () => {
  const openCreateExperiment = useModalStore((state) => state.openCreateExperiment)
  const setOpenCreateExperiment = useModalStore((state) => state.setOpenCreateExperiment)
  const { notify } = useNotification()
  const createExperimentMutation = useCreateExperiment()

  const errorMessage = useMemo(
    () => createExperimentMutation.error?.message ?? null,
    [createExperimentMutation.error?.message]
  )

  const formContext = useForm<CreateExperimentDto>({
    defaultValues: {
      title: "",
      objective: "",
      type: ""
    }
  })
  const [showError, setShowError] = useState(false)

  const handleCreateExperiment = (data: CreateExperimentDto) => {
    setShowError(false)
    createExperimentMutation.mutate(data, {
      onSuccess: () => {
        notify("Experiment created successfully", "success")
        handleClose()
      }
    })
  }

  const handleCloseError = () => {
    setShowError(false)
  }

  const handleClose = () => {
    setShowError(false)
    formContext.reset()
    createExperimentMutation.reset()
    setOpenCreateExperiment(false)
  }

  useEffect(() => {
    if (errorMessage) {
      setShowError(true)
    } else {
      setShowError(false)
    }
  }, [errorMessage])

  return (
    <Dialog open={openCreateExperiment} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">Create Experiment</DialogTitle>
      <FormContainer
        formContext={formContext}
        handleSubmit={formContext.handleSubmit(handleCreateExperiment)}
      >
        <DialogContent>
          <Grid container spacing={4}>
            <Grid size={3}>
              <FormLabel className="font-bold" required htmlFor="email">
                Title
              </FormLabel>
            </Grid>
            <Grid size={9}>
              <TextFieldElement
                id="title"
                type="text"
                name="title"
                placeholder="Experiment title"
                autoFocus
                required
                fullWidth
                variant="outlined"
                size="small"
                disabled={createExperimentMutation.isPending}
              />
            </Grid>
            <Grid size={3}>
              <FormLabel className="font-bold" required htmlFor="type">
                Type
              </FormLabel>
              <Typography variant="body2" color="textSecondary">
                Choose the type of experiment
              </Typography>
            </Grid>
            <Grid size={9}>
              <RadioButtonGroup
                name="type"
                options={[
                  { id: "exploratory", label: "Exploratory" },
                  { id: "confirmatory", label: "Confirmatory" }
                ]}
                row
              />
            </Grid>
            <Grid size={3}>
              <FormLabel className="font-bold" required htmlFor="email">
                Objective
              </FormLabel>
              <Typography variant="body2" color="textSecondary">
                What do you want to achieve with this experiment?
              </Typography>
            </Grid>
            <Grid size={9}>
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
                disabled={createExperimentMutation.isPending}
              />
            </Grid>{" "}
          </Grid>
          <Collapse in={showError && !!errorMessage}>
            <Alert severity="error" onClose={handleCloseError} sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          </Collapse>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            loading={createExperimentMutation.isPending}
            disabled={createExperimentMutation.isPending || !formContext.formState.isValid}
          >
            Create
          </Button>
        </DialogActions>
      </FormContainer>
    </Dialog>
  )
}

export default CreateExperiment
