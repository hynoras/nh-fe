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
  IconButton,
  InputAdornment,
  Popover,
  Snackbar,
  Stack,
  TextField,
  TextFieldProps,
  Tooltip,
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
import { deletePermissionGroupApi, getPermissionGroupListApi } from "service/permission"
import { Permission, PermissionGroup } from "./_domain/entity/permission"
import { PermissionGroupListFilter } from "./_type/permission-group"

type DeletePermissionGroupDialogProps = {
  open: boolean
  onClose: () => void
  selectedPermissionGroup: PermissionGroup | null
  handleDeletePermissionGroup: () => void
}

const DeletePermissionGroupDialog = ({
  open,
  onClose,
  selectedPermissionGroup,
  handleDeletePermissionGroup
}: DeletePermissionGroupDialogProps) => {
  const [disableDeleteButton, setDisableDeleteButton] = useState(true)

  const handleConfirmDeleteInputChange = (value: string) => {
    setDisableDeleteButton(value !== selectedPermissionGroup?.name)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`Deleting ${selectedPermissionGroup?.name}`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure about deleting this permission group? This action can not be
          undone.
        </DialogContentText>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="caption" color="text">
            Type "{selectedPermissionGroup?.name}" to confirm.
          </Typography>
        </DialogContentText>
        <TextField
          fullWidth
          id="confirm-delete-input"
          placeholder="Type permission group name to confirm"
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
          onClick={handleDeletePermissionGroup}
          autoFocus
          disabled={disableDeleteButton}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const RoleList = () => {
  const [tableHeight, setTableHeight] = useState<number>(0)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedPermissionGroup, setSelectedPermissionGroup] =
    useState<PermissionGroup | null>(null)
  const [permissionGroupListFilter, setPermissionGroupListFilter] =
    useState<PermissionGroupListFilter>({
      search: "",
      page: 1,
      pageSize: 10
    })
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [anchorPermissionPopper, setAnchorPermissionPopper] =
    useState<null | HTMLElement>(null)

  const tableRef = useRef<HTMLDivElement>(null)

  const open = Boolean(anchorPermissionPopper)

  const queryClient = useQueryClient()
  const { data: permissionGroupsData, isLoading } = useQuery({
    queryKey: ["permission-groups", permissionGroupListFilter],
    queryFn: () =>
      getPermissionGroupListApi(
        permissionGroupListFilter.search,
        permissionGroupListFilter.page,
        permissionGroupListFilter.pageSize
      ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  const deletePermissionGroupMutation = useMutation({
    mutationFn: (permissionGroupId: string) =>
      deletePermissionGroupApi(permissionGroupId),
    onSuccess: () => {
      handleCloseDeleteDialog()
      setSnackbarOpen(true)
      queryClient.invalidateQueries({ queryKey: ["permission-groups"] })
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
    setPermissionGroupListFilter((prev) => ({
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

  const handleCreatePermissionGroup = () => {
    router.push(navigationRoutes.userAndAccess.role.create)
  }

  const handleOpenPermissionPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorPermissionPopper(event.currentTarget)
  }

  const handleClosePermissionPopover = () => {
    setAnchorPermissionPopper(null)
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleNavigateToEditRole = (permissionGroupId: string) => {
    router.push(navigationRoutes.userAndAccess.role.detail(permissionGroupId))
  }

  const handleDeletePermissionGroup = () => {
    if (selectedPermissionGroup) {
      deletePermissionGroupMutation.mutate(selectedPermissionGroup.id as string)
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
          <Overflow
            className="flex gap-2"
            data={permissions}
            renderItem={(item: Permission) => <Chip key={item.id} label={item.name} />}
            renderRest={(omittedItems) => (
              <>
                <Popover
                  id="permission-popper"
                  className="pointer-events-none flex gap-2 max-w-300"
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={deletePermissionGroupMutation.isError ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {deletePermissionGroupMutation.isError
            ? deletePermissionGroupMutation.error.message
            : "Permission group deleted successfully"}
        </Alert>
      </Snackbar>
      <DeletePermissionGroupDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        selectedPermissionGroup={selectedPermissionGroup}
        handleDeletePermissionGroup={handleDeletePermissionGroup}
      />
      <Box sx={{ width: "100%" }}>
        <Stack direction={"column"} spacing={2}>
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Stack direction={"row"} spacing={1}>
              <TextField
                id="outlined-basic"
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
            </Stack>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreatePermissionGroup}
            >
              Create Permission Group
            </Button>
          </Stack>
          <Box sx={{ height: tableHeight }} ref={tableRef}>
            <DataGrid
              rows={permissionGroupsData?.data || []}
              columns={columns}
              loading={isLoading}
              paginationMode="server"
              rowCount={permissionGroupsData?.length || 0}
              paginationModel={{
                page: permissionGroupListFilter.page - 1,
                pageSize: permissionGroupListFilter.pageSize
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

export default RoleList
