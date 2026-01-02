import {
  Alert,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  Modal,
  Stack
} from "@mui/material"
import { useEffect, useState } from "react"
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui"
import { CreateExperimentDto } from "../_domain/dto/experiment"
import AddIcon from "@mui/icons-material/Add"

type CreateExperimentProps = {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateExperimentDto) => void
  loading?: boolean
  disabled?: boolean
  error?: string | null
}

const CreateExperiment = ({
  open,
  onClose,
  onSubmit,
  loading,
  disabled,
  error
}: CreateExperimentProps) => {
  const formContext = useForm<CreateExperimentDto>({
    defaultValues: {
      title: "",
      objective: ""
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

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">Create Experiment</DialogTitle>
      <FormContainer
        formContext={formContext}
        handleSubmit={formContext.handleSubmit(handleCreateExperiment)}
      >
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <div>
              <FormLabel className="font-semibold" required htmlFor="email">
                Experiment title
              </FormLabel>
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
            </div>
            <div>
              <FormLabel className="font-semibold" required htmlFor="email">
                Objective
              </FormLabel>
              <TextFieldElement
                id="objective"
                type="text"
                name="objective"
                placeholder="Experiment objective"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
                size="small"
                disabled={disabled}
              />
            </div>
          </Stack>
          <Collapse in={showError && !!error}>
            <Alert severity="error" onClose={handleCloseError} sx={{ mt: 2 }}>
              {error}
            </Alert>
          </Collapse>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="primary">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="small"
              className="mt-4 font-bold"
              startIcon={<AddIcon />}
              loading={loading}
              disabled={disabled || !formContext.formState.isValid}
            >
              Create
            </Button>
          </DialogActions>
        </DialogContent>
      </FormContainer>
    </Dialog>
  )
}

export default CreateExperiment
