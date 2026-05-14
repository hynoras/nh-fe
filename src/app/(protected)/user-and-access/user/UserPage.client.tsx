"use client"

import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import {
  Alert,
  Box,
  Chip,
  IconButton,
  Popover,
  Snackbar,
  Stack,
  Typography
} from "@mui/material"
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams
} from "@mui/x-data-grid"
import TableToolbar from "components/filter/TableToolbar"
import Popup from "components/popup"
import { navigationRoutes } from "consts/navigation"
import { format } from "date-fns"
import { useDeleteUser, useUserList } from "hooks/queries/user"
import { useResponsiveHeight } from "hooks/responsive"
import { useRouter } from "next/navigation"
import Overflow from "rc-overflow"
import { useRef, useState } from "react"
import { Permission } from "../role/_domain/entity/permission"
import { User } from "./_domain/entity/user"
import { UserListFilter } from "./_types/user"

const UserPageClient = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userListFilter, setUserListFilter] = useState<UserListFilter>({
    search: "",
    page: 1,
    pageSize: 10
  })
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [anchorPermissionPopper, setAnchorPermissionPopper] =
    useState<null | HTMLElement>(null)

  const tableRef = useRef<HTMLDivElement>(null)
  const tableHeight = useResponsiveHeight(tableRef)

  const open = Boolean(anchorPermissionPopper)

  const { data: usersData, isLoading } = useUserList(userListFilter)

  const deleteUserMutation = useDeleteUser()
  const router = useRouter()

  const handleCreateUser = () => {
    router.push(navigationRoutes.userAndAccess.user.create)
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

  const handleEditUser = (userId: string) => {
    router.push(navigationRoutes.userAndAccess.user.detail(userId))
  }

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate([selectedUser.id as string], {
        onSuccess: () => {
          handleCloseDeleteDialog()
          setSnackbarOpen(true)
        },
        onError: (error) => {
          setSnackbarOpen(true)
          console.error(error)
        }
      })
    }
  }

  const columns: GridColDef[] = [
    {
      field: "email",
      headerName: "Username",
      sortable: true,
      resizable: true,
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
    {
      field: "roles",
      headerName: "Assigned Roles",
      sortable: false,
      resizable: false,
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
      renderCell: (params: GridRenderCellParams<User, string>) => {
        return (
          <Stack
            height={"100%"}
            direction={"row"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            spacing={2}
          >
            <IconButton onClick={() => handleEditUser(params.row.id as string)}>
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
      <Popup.DeleteConfirmation
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        instance={{ name: selectedUser?.username || "", type: "user" }}
        handleDelete={handleDeleteUser}
      />
      <Box sx={{ width: "100%" }}>
        <Stack direction={"column"} spacing={2}>
          <TableToolbar
            filter={userListFilter}
            setFilter={setUserListFilter}
            searchBar={{
              placeholder: "Search by email"
            }}
            primaryButton={{
              children: "Create User",
              startIcon: <AddIcon />,
              onClick: handleCreateUser
            }}
          />
          <Box sx={{ height: tableHeight }} ref={tableRef}>
            <DataGrid
              rows={usersData?.data || []}
              columns={columns}
              loading={isLoading}
              paginationMode="server"
              rowCount={usersData?.length || 0}
              paginationModel={{
                page: (userListFilter?.page || 1) - 1,
                pageSize: userListFilter?.pageSize || 10
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

export default UserPageClient
