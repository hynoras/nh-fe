import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material"
import { useState } from "react"

type DeleteConfirmationProps = {
  open: boolean
  onClose: () => void
  instance: {
    name: string
    type?: string
  }
  handleDeleteUser: () => void
}

const DeleteConfirmation = ({
  open,
  onClose,
  instance,
  handleDeleteUser
}: DeleteConfirmationProps) => {
  const [disableDeleteButton, setDisableDeleteButton] = useState(true)

  const handleConfirmDeleteInputChange = (value: string) => {
    setDisableDeleteButton(value !== instance.name)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{`Deleting ${instance.name}`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Are you sure about deleting this ${instance.type ?? "instance"}? This action can not be undone.`}
        </DialogContentText>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="caption" color="text">
            Type "{instance.name}" to confirm.
          </Typography>
        </DialogContentText>
        <TextField
          fullWidth
          id="confirm-delete-input"
          placeholder={`Type ${instance.name} to confirm`}
          variant="outlined"
          size="small"
          autoFocus
          onChange={(e) => handleConfirmDeleteInputChange(e.target.value as string)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Cancel
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteUser}
          autoFocus
          disabled={disableDeleteButton}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmation
