"use client"

import { Search } from "@mui/icons-material"
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  TextFieldProps,
  debounce
} from "@mui/material"
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import ChipOverflowList from "components/ChipOverflowList"
import { usePermissionGroups, useUpdateUser, useUserDetail } from "hooks/queries/user"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Permission, PermissionGroup } from "../../role/_domain/entity/permission"
import { UpdateUserDto } from "../_domain/dto/user"
import { PermissionGroupListFilter } from "../_types/user"

const RoleAndPermission = () => {
  const { userId } = useParams<{ userId: string }>()

  // State Management
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState<{
    type: "success" | "error"
    message: string
  }>({ type: "success", message: "" })
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [originalPermissions, setOriginalPermissions] = useState<string[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const [permissionGroupFilter, setPermissionGroupFilter] =
    useState<PermissionGroupListFilter>({
      search: "",
      page: 1,
      pageSize: 100
    })

  // Queries
  const { data: userDetail } = useUserDetail(userId as string)

  const { data: permissionGroups, isLoading: isLoadingPermissionGroups } =
    usePermissionGroups(permissionGroupFilter)

  // Initialize permissions when both user detail and permission groups are loaded
  useEffect(() => {
    if (userDetail?.data && permissionGroups?.data && !isInitialized) {
      const permissionIds = userDetail.data.roles
        ? (userDetail.data.roles.map((role) => role.id).filter(Boolean) as string[])
        : []
      setSelectedPermissions(permissionIds)
      setOriginalPermissions(permissionIds)
      setIsInitialized(true)
    }
  }, [userDetail, permissionGroups, isInitialized])

  // Track unsaved changes
  useEffect(() => {
    const hasChanges =
      JSON.stringify(selectedPermissions.sort()) !==
      JSON.stringify(originalPermissions.sort())
    setHasUnsavedChanges(hasChanges)
  }, [selectedPermissions, originalPermissions])

  // Warn on navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    if (hasUnsavedChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload)
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [hasUnsavedChanges])

  // Mutation
  const updatePermissionsMutation = useUpdateUser(userId as string)

  // Handlers
  const handleSearch: TextFieldProps["onChange"] = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPermissionGroupFilter((prev: PermissionGroupListFilter) => ({
      ...prev,
      search: e.target.value
    }))
  }

  const debouncedHandleSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleSearch(e)
    }, 500),
    [handleSearch]
  )

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
    setSnackbarMessage({ type: "success", message: "" })
  }

  const handleSave = () => {
    updatePermissionsMutation.mutate(
      { permissions: selectedPermissions } as UpdateUserDto,
      {
        onSuccess: () => {
          setOriginalPermissions(selectedPermissions) // Update original state after successful save
          setSnackbarMessage({
            type: "success",
            message: "Permissions updated successfully"
          })
          setSnackbarOpen(true)
        },
        onError: (error: any) => {
          setSnackbarMessage({
            type: "error",
            message: error.message || "Failed to update permissions"
          })
          setSnackbarOpen(true)
          // Keep current selection on error (don't reset)
        }
      }
    )
  }

  const handleDiscard = () => {
    setSelectedPermissions(originalPermissions)
  }

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 0.5
    },
    {
      field: "permissions",
      headerName: "Permissions",
      flex: 0.5,
      renderCell: (params: GridRenderCellParams<PermissionGroup, Permission[]>) => {
        const permissions = params.row.permissions || []
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
      field: "description",
      headerName: "Description",
      flex: 1
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

      <Stack direction="column" spacing={2}>
        {/* Toolbar with search and action buttons */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <TextField
            placeholder="Search by name"
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
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={handleDiscard}
              disabled={!hasUnsavedChanges}
            >
              Discard
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!hasUnsavedChanges || updatePermissionsMutation.isPending}
            >
              Save
            </Button>
          </Stack>
        </Stack>

        {/* DataGrid */}
        <Box className="min-h-[400px]">
          <DataGrid
            rows={permissionGroups?.data || []}
            columns={columns}
            loading={isLoadingPermissionGroups || updatePermissionsMutation.isPending}
            //rowCount={permissionGroups?.data?.length || 0}
            checkboxSelection
            disableRowSelectionOnClick
            rowSelectionModel={{
              type: "include",
              ids: new Set(selectedPermissions)
            }}
            onRowSelectionModelChange={(newSelectionModel) => {
              if (isInitialized) {
                const ids =
                  newSelectionModel.type === "include"
                    ? Array.from(newSelectionModel.ids)
                    : []
                setSelectedPermissions(ids as string[])
              }
            }}
            sx={{
              border: 0,
              "& .MuiDataGrid-footerContainer": {
                display: "none"
              }
            }}
          />
        </Box>
      </Stack>
    </>
  )
}

export default RoleAndPermission
