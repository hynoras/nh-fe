"use client"

import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { Box, IconButton, Stack, Tooltip } from "@mui/material"
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
import {
  useDeletePermissionGroup,
  usePermissionGroupList
} from "hooks/queries/permission"
import { useNotification } from "hooks/notification"
import { useResponsiveHeight } from "hooks/responsive"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { Permission, PermissionGroup } from "./_domain/entity/permission"
import { PermissionGroupListFilter } from "./_types/permission-group"

const RolePageClient = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedPermissionGroup, setSelectedPermissionGroup] =
    useState<PermissionGroup | null>(null)
  const [permissionGroupListFilter, setPermissionGroupListFilter] =
    useState<PermissionGroupListFilter>({
      search: "",
      page: 1,
      pageSize: 10
    })

  const tableRef = useRef<HTMLDivElement>(null)
  const tableHeight = useResponsiveHeight(tableRef)

  const { data: permissionGroupsData, isLoading } = usePermissionGroupList(
    permissionGroupListFilter
  )

  const deletePermissionGroupMutation = useDeletePermissionGroup()
  const router = useRouter()
  const { notify } = useNotification()

  const handleCreatePermissionGroup = () => {
    router.push(navigationRoutes.userAndAccess.role.create)
  }

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPermissionGroupListFilter((prev) => ({
      ...prev,
      page: model.page + 1,
      pageSize: model.pageSize
    }))
  }

  const handleClickOpen = (permissionGroup: PermissionGroup) => {
    setSelectedPermissionGroup(permissionGroup)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setSelectedPermissionGroup(null)
  }

  const handleNavigateToEditRole = (permissionGroupId: string) => {
    router.push(navigationRoutes.userAndAccess.role.detail(permissionGroupId))
  }

  const handleDeletePermissionGroup = () => {
    if (selectedPermissionGroup) {
      deletePermissionGroupMutation.mutate(selectedPermissionGroup.id as string, {
        onSuccess: () => {
          handleCloseDeleteDialog()
          notify("Permission group deleted successfully", "success")
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
      field: "name",
      headerName: "Name",
      sortable: true,
      resizable: true,
      flex: 1
    },
    {
      field: "description",
      headerName: "Description",
      sortable: false,
      resizable: true,
      flex: 1
    },
    {
      field: "permissions",
      headerName: "Permissions",
      sortable: false,
      resizable: false,
      flex: 1,
      renderCell: (params: GridRenderCellParams<PermissionGroup, Permission[]>) => {
        const permissions = params.value || []
        return (
          <ChipOverflowList
            items={permissions}
            getItemId={(item) => item.id ?? ""}
            getItemLabel={(item) => item.name ?? ""}
            popoverId={`permissions-popover-${params.row.id}`}
          />
        )
      }
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 0.6,
      valueGetter: (_, row) => {
        return format(new Date(row.createdAt as string), "dd/MM/yyyy HH:mm")
      }
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 0.6,
      valueGetter: (_, row) => {
        return format(new Date(row.updatedAt as string), "dd/MM/yyyy HH:mm")
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
            <IconButton onClick={() => handleNavigateToEditRole(params.row.id as string)}>
              <EditIcon />
            </IconButton>
            <Tooltip title="This role can not be deleted">
              <IconButton
                color="error"
                onClick={() => handleClickOpen(params.row)}
                disabled={params.row.name === "Super Admin"}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
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
        instance={{ name: selectedPermissionGroup?.name || "", type: "permission group" }}
        handleDelete={handleDeletePermissionGroup}
      />
      <Box sx={{ width: "100%" }}>
        <Stack direction={"column"} spacing={2}>
          <TableToolbar
            filter={permissionGroupListFilter}
            setFilter={setPermissionGroupListFilter}
            searchBar={{
              placeholder: "Search by name"
            }}
            primaryButton={{
              children: "Create Role",
              startIcon: <AddIcon />,
              onClick: handleCreatePermissionGroup
            }}
          />
          <Box sx={{ height: tableHeight }} ref={tableRef}>
            <DataGrid
              rows={permissionGroupsData?.data || []}
              columns={columns}
              loading={isLoading}
              paginationMode="server"
              rowCount={permissionGroupsData?.length || 0}
              paginationModel={{
                page: (permissionGroupListFilter.page || 1) - 1,
                pageSize: permissionGroupListFilter.pageSize || 10
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

export default RolePageClient
