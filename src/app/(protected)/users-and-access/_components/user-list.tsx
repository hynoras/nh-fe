"use client"

import { Search } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Snackbar,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
  debounce
} from "@mui/material"
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams
} from "@mui/x-data-grid"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { navigationRoutes } from "consts/navigation"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import Overflow from "rc-overflow"
import { useCallback, useEffect, useRef, useState } from "react"
import { deleteUserApi, getUserListApi } from "service/user"
import { Permission, User } from "../_domain/entity/user"
import { UserListFilter } from "../_types/user"

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

const UserPage = () => {
  const [tableHeight, setTableHeight] = useState<number>(0)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userListFilter, setUserListFilter] = useState<UserListFilter>({
    search: "",
    role: "",
    page: 1,
    pageSize: 10
  })
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [anchorPermissionPopper, setAnchorPermissionPopper] =
    useState<null | HTMLElement>(null)

  const tableRef = useRef<HTMLDivElement>(null)

  const open = Boolean(anchorPermissionPopper)

  const queryClient = useQueryClient()
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["users", userListFilter],
    queryFn: () =>
      getUserListApi(
        userListFilter.search,
        userListFilter.role,
        userListFilter.page,
        userListFilter.pageSize
      ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string[]) => deleteUserApi(userId),
    onSuccess: () => {
      handleCloseDeleteDialog()
      setSnackbarOpen(true)
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (error) => {
      setSnackbarOpen(true)
      console.error(error)
    }
  })
  const router = useRouter()

  const handleSearch: TextFieldProps["onChange"] = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUserListFilter((prev) => ({ ...prev, search: e.target.value }))
  }

  const debouncedHandleSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleSearch(e)
    }, 500),
    [handleSearch]
  )

  const handleCreateUser = () => {
    router.push(navigationRoutes.usersAndAccess.createUser)
  }

  const handleOpenPermissionPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorPermissionPopper(event.currentTarget)
  }

  const handleClosePermissionPopover = () => {
    setAnchorPermissionPopper(null)
  }

  const handlePaginationChange = (model: GridPaginationModel) => {
    setUserListFilter((prev) => ({
      ...prev,
      page: model.page + 1,
      pageSize: model.pageSize
    }))
  }

  const handleClickOpen = (user: User) => {
    setSelectedUser(user)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setSelectedUser(null)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate([selectedUser.id as string])
    }
  }

  useEffect(() => {
    if (!tableRef.current) return

    const updateHeight = () => {
      const rect = tableRef.current?.getBoundingClientRect()
      if (rect) {
        const topOffset = rect.top
        const bottomPadding = 20
        const calculated = window.innerHeight - topOffset - bottomPadding
        setTableHeight(calculated)
      }
    }

    updateHeight()
    // Update on window resize
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [window.innerHeight, tableRef])

  const columns: GridColDef[] = [
    {
      field: "email",
      headerName: "Username",
      flex: 1,
      valueGetter: (_, row) => {
        return `${row.username}-${row.email}`
      },
      renderCell: (params: GridRenderCellParams<any, string>) => {
        const [username, email] = params.value?.split("-") || []
        return (
          <Stack height={"100%"} direction={"column"} spacing={0.5}>
            <Typography variant="body1" color="text">
              {username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {email}
            </Typography>
          </Stack>
        )
      }
    },
    { field: "role", headerName: "Role", flex: 0.4 },
    {
      field: "permissions",
      headerName: "Permissions",
      flex: 1,
      renderCell: (params: GridRenderCellParams<User, Permission[]>) => {
        const permissions = params.value
        return (
          <Overflow
            className="flex gap-2"
            data={permissions}
            renderItem={(item: Permission) => <Chip key={item.id} label={item.name} />}
            renderRest={(omittedItems) => (
              <>
                <Popover
                  id="permission-popper"
                  className="pointer-events-none flex gap-2"
                  open={open}
                  anchorEl={anchorPermissionPopper}
                  onClose={handleClosePermissionPopover}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left"
                  }}
                >
                  {omittedItems.map((item) => (
                    <Chip key={item.id} label={item.name} />
                  ))}
                </Popover>
                <Chip
                  aria-owns={open ? "permission-popper" : undefined}
                  aria-haspopup="true"
                  label={`+${omittedItems.length}`}
                  onMouseEnter={handleOpenPermissionPopover}
                  onMouseLeave={handleClosePermissionPopover}
                />
              </>
            )}
            maxCount={"responsive"}
            component={Box}
          />
        )
      }
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 0.6,
      valueGetter: (_, row) => {
        return format(row.createdAt as Date, "dd/MM/yyyy HH:mm")
      }
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 0.6,
      valueGetter: (_, row) => {
        return format(row.createdAt as Date, "dd/MM/yyyy HH:mm")
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      sortable: false,
      resizable: false,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        return (
          <Stack
            height={"100%"}
            direction={"row"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            spacing={2}
          >
            <IconButton>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleClickOpen(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        )
      }
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
          severity={deleteUserMutation.isError ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {deleteUserMutation.isError
            ? deleteUserMutation.error.message
            : "User deleted successfully"}
        </Alert>
      </Snackbar>
      <DeleteUserDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        selectedUser={selectedUser}
        handleDeleteUser={handleDeleteUser}
      />
      <Box sx={{ width: "100%" }}>
        <Stack direction={"column"} spacing={2}>
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Stack direction={"row"} spacing={1}>
              <TextField
                id="outlined-basic"
                placeholder="Search by email"
                variant="outlined"
                size="small"
                onChange={(e) => debouncedHandleSearch(e)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Search />
                      </InputAdornment>
                    )
                  }
                }}
              />
              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel id="select-role-label">Select Role</InputLabel>
                <Select
                  size="small"
                  labelId="select-role-label"
                  label="Select Role"
                  value={userListFilter.role}
                  onChange={(e) =>
                    setUserListFilter((prev) => ({ ...prev, role: e.target.value }))
                  }
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value={"admin"}>Admin</MenuItem>
                  <MenuItem value={"user"}>User</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateUser}
            >
              Create User
            </Button>
          </Stack>
          <Box sx={{ height: tableHeight }} ref={tableRef}>
            <DataGrid
              rows={usersData?.data || []}
              columns={columns}
              loading={isLoading}
              paginationMode="server"
              rowCount={usersData?.length || 0}
              paginationModel={{
                page: userListFilter.page - 1,
                pageSize: userListFilter.pageSize
              }}
              onPaginationModelChange={handlePaginationChange}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              sx={{
                border: 0
              }}
            />
          </Box>
        </Stack>
      </Box>
    </>
  )
}

export default UserPage
