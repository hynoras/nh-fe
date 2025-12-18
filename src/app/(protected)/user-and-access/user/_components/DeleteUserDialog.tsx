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
import { User } from "../_domain/entity/user"

type DeleteUserDialogProps = {
  open: boolean
  onClose: () => void
  selectedUser: User | null
  handleDeleteUser: () => void
}

const DeleteUserDialog = ({
  open,
  onClose,
  selectedUser,
  handleDeleteUser
}: DeleteUserDialogProps) => {
  const [disableDeleteButton, setDisableDeleteButton] = useState(true)

  const handleConfirmDeleteInputChange = (value: string) => {
    setDisableDeleteButton(value !== selectedUser?.username)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{`Deleting ${selectedUser?.username}`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure about deleting this user? This action can not be undone.
        </DialogContentText>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="caption" color="text">
            Type "{selectedUser?.username}" to confirm.
          </Typography>
        </DialogContentText>
        <TextField
          fullWidth
          id="confirm-delete-input"
          placeholder="Type username to confirm"
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

export default DeleteUserDialog
