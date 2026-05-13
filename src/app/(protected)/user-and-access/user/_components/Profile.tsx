"use client"

import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import EditIcon from "@mui/icons-material/Edit"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { Alert, IconButton, Snackbar, Stack, TextField, Typography } from "@mui/material"
import Grid from "@mui/material/Grid2"
import { format } from "date-fns"
import { useUpdateUser, useUserDetail } from "hooks/queries/user"
import { useParams } from "next/navigation"
import { Fragment, ReactNode, useState } from "react"
import { UpdateUserDto } from "../_domain/dto/user"

interface IDescriptionItem {
  label: ReactNode
  value: ReactNode
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>()

  const { data: userDetail } = useUserDetail(userId as string)

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState<{
    type: "success" | "error"
    message: string
  }>({ type: "success", message: "" })
  const [visibleUserId, setVisibleUserId] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [editedEmail, setEditedEmail] = useState("")

  const updateEmailMutation = useUpdateUser(userId as string)

  const handleCopyUserInfo = (value: string, label: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setSnackbarOpen(true)
        setSnackbarMessage({ type: "success", message: `${label} copied to clipboard` })
      })
      .catch((error) => {
        console.error(error)
        setSnackbarOpen(true)
        setSnackbarMessage({ type: "error", message: error.message })
      })
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
    setSnackbarMessage({ type: "success", message: "" })
  }

  const handleSaveEmail = () => {
    // Validate email is not empty
    if (!editedEmail.trim()) {
      setSnackbarMessage({
        type: "error",
        message: "Email cannot be empty"
      })
      setSnackbarOpen(true)
      return
    }
    // Trigger mutation
    updateEmailMutation.mutate({ email: editedEmail } as UpdateUserDto, {
      onSuccess: () => {
        setIsEditingEmail(false)
        setEditedEmail("")
      },
      onError: (error: any) => {
        setSnackbarMessage({
          type: "error",
          message: error.message || "Failed to update email"
        })
        setSnackbarOpen(true)
        // Keep isEditingEmail as true to stay in edit mode
      }
    })
  }

  const handleCancelEdit = () => {
    setEditedEmail(userDetail?.data?.email || "")
    setIsEditingEmail(false)
  }

  const descriptionItems: IDescriptionItem[] = [
    {
      label: "User ID",
      value: (
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"flex-start"}
          spacing={1}
        >
          <Typography variant="body1">
            {visibleUserId ? userDetail?.data?.id : "****************"}
          </Typography>
          <IconButton
            size="small"
            onClick={() => handleCopyUserInfo(userDetail?.data?.id || "", "User ID")}
          >
            <ContentCopyIcon />
          </IconButton>
          <IconButton size="small" onClick={() => setVisibleUserId(!visibleUserId)}>
            {visibleUserId ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </Stack>
      )
    },
    {
      label: "Email",
      value: (
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"flex-start"}
          spacing={1}
        >
          {isEditingEmail ? (
            <TextField
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveEmail()
                } else if (e.key === "Escape") {
                  handleCancelEdit()
                }
              }}
              onBlur={handleSaveEmail}
              autoFocus
              size="small"
              variant="outlined"
              disabled={updateEmailMutation.isPending}
              type="email"
              fullWidth
            />
          ) : (
            <>
              <Typography variant="body1">{userDetail?.data?.email}</Typography>
              <IconButton
                size="small"
                onClick={() => handleCopyUserInfo(userDetail?.data?.email || "", "Email")}
              >
                <ContentCopyIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  setIsEditingEmail(true)
                  setEditedEmail(userDetail?.data?.email || "")
                }}
              >
                <EditIcon />
              </IconButton>
            </>
          )}
        </Stack>
      )
    },
    {
      label: "Created At",
      value: format(userDetail?.data?.createdAt || new Date(), "dd/MM/yyyy HH:mm") ?? "-"
    },
    {
      label: "Last Updated",
      value: format(userDetail?.data?.updatedAt || new Date(), "dd/MM/yyyy HH:mm") ?? "-"
    }
  ]

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
      <Stack direction={"column"} spacing={2}>
        <Typography variant="h6">About this user</Typography>
        <Grid container spacing={2}>
          {descriptionItems.map((item, index) => (
            <Fragment key={index}>
              <Grid size={2} alignItems={"center"}>
                {typeof item.label === "string" ? (
                  <Typography variant="body1" color="text">
                    {item.label}
                  </Typography>
                ) : (
                  item.label
                )}
              </Grid>
              <Grid size={10} justifyContent={"center"} alignItems={"center"}>
                {typeof item.value === "string" ? (
                  <Typography variant="body1" color="text.secondary">
                    {item.value}
                  </Typography>
                ) : (
                  item.value
                )}
              </Grid>
            </Fragment>
          ))}
        </Grid>
      </Stack>
    </>
  )
}

export default UserProfile
