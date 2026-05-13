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
import { useEffect, useState } from "react"
import {
  FormContainer,
  RadioButtonGroup,
  TextFieldElement,
  useForm
} from "react-hook-form-mui"
import { CreateExperimentDto } from "../_domain/dto/experiment"

type CreateExperimentProps = {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateExperimentDto) => void
  loading?: boolean
  disabled?: boolean
  error?: string | null
  success?: boolean
}

const CreateExperiment = ({
  open,
  onClose,
  onSubmit,
  loading,
  disabled,
  error,
  success
}: CreateExperimentProps) => {
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
    onSubmit(data)
  }

  const handleCloseError = () => {
    setShowError(false)
  }

  const handleClose = () => {
    setShowError(false)
    formContext.reset()
    onClose()
  }

  // Show error when error prop changes
  useEffect(() => {
    if (error) {
      setShowError(true)
    } else {
      setShowError(false)
    }
  }, [error])

  // Reset form when success prop changes to true
  useEffect(() => {
    if (success) {
      formContext.reset()
      setShowError(false)
    }
  }, [success, formContext])

  return (
    <Dialog open={open} onClose={handleClose}>
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
                disabled={disabled}
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
                disabled={disabled}
              />
            </Grid>{" "}
          </Grid>
          <Collapse in={showError && !!error}>
            <Alert severity="error" onClose={handleCloseError} sx={{ mt: 2 }}>
              {error}
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
            loading={loading}
            disabled={disabled || !formContext.formState.isValid}
          >
            Create
          </Button>
        </DialogActions>
      </FormContainer>
    </Dialog>
  )
}

export default CreateExperiment
