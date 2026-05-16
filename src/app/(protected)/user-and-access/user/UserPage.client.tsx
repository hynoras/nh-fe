"use client"

import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { Alert, Box, IconButton, Snackbar, Stack, Typography } from "@mui/material"
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams
} from "@mui/x-data-grid"
import ChipOverflowList from "components/ChipOverflowList"
import TableToolbar from "components/filter/TableToolbar"
import Popup from "components/popup"
import { navigationRoutes } from "consts/navigation"
import { format } from "date-fns"
import { useDeleteUser, useUserList } from "hooks/queries/user"
import { useResponsiveHeight } from "hooks/responsive"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { Permission } from "../role/_domain/entity/permission"
import { User } from "./_domain/entity/user"
import { UserListFilter } from "./_types/user"
import { useNotification } from "hooks/notification"

const UserPageClient = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userListFilter, setUserListFilter] = useState<UserListFilter>({
    search: "",
    page: 1,
    pageSize: 10
  })
  const tableRef = useRef<HTMLDivElement>(null)
  const tableHeight = useResponsiveHeight(tableRef)

  const { data: usersData, isLoading } = useUserList(userListFilter)

  const deleteUserMutation = useDeleteUser()
  const router = useRouter()
  const { notify } = useNotification()

  const handleCreateUser = () => {
    router.push(navigationRoutes.userAndAccess.user.create)
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

  const handleEditUser = (userId: string) => {
    router.push(navigationRoutes.userAndAccess.user.detail(userId))
  }

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate([selectedUser.id as string], {
        onSuccess: () => {
          handleCloseDeleteDialog()
          notify("User deleted successfully", "success")
        },
        onError: (error) => {
          notify(error.message, "error")
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
        return <ChipOverflowList items={permissions || []} />
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
