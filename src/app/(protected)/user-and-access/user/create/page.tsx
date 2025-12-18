"use client"

import { Search } from "@mui/icons-material"
import AccessibilityIcon from "@mui/icons-material/Accessibility"
import AddIcon from "@mui/icons-material/Add"
import PersonIcon from "@mui/icons-material/Person"
import {
  Alert,
  Box,
  Button,
  Chip,
  FormLabel,
  InputAdornment,
  Popover,
  Snackbar,
  Stack,
  TextField,
  TextFieldProps,
  debounce
} from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import CustomForm from "components/form"
import { navigationRoutes } from "consts/navigation"
import { useRouter } from "next/navigation"
import Overflow from "rc-overflow"
import { useCallback, useState } from "react"
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
  useForm
} from "react-hook-form-mui"
import { getPermissionGroupListApi } from "service/permission"
import { createUserApi } from "../../../../../service/user"
import { CreateUserDto } from "../_domain/dto/user"
import { Permission } from "../_domain/entity/permission"
import { PermissionGroupListFilter } from "../_types/user"

const CreateUserPage = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [anchorPermissionPopper, setAnchorPermissionPopper] =
    useState<null | HTMLElement>(null)
  const queryClient = useQueryClient()
  const router = useRouter()

  const open = Boolean(anchorPermissionPopper)

  const [permissionGroupFilter, setPermissionGroupFilter] =
    useState<PermissionGroupListFilter>({
      search: "",
      page: 1,
      pageSize: 100
    })

  const { data: permissionGroups, isLoading: isLoadingPermissionGroups } = useQuery({
    queryKey: ["permissionGroups", permissionGroupFilter],
    queryFn: () =>
      getPermissionGroupListApi(
        permissionGroupFilter.search,
        permissionGroupFilter.page,
        permissionGroupFilter.pageSize
      )
  })

  const formContext = useForm<CreateUserDto>({
    defaultValues: {
      username: "",
      email: "",
      password: "CHANGETHISAFTERWARDS",
      role: "user",
      permissions: []
    }
  })

  const roleOptions = [
    { label: "User", id: "user" },
    { label: "Admin", id: "admin" }
  ]

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

  const createUserMutation = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setSnackbarOpen(true)
      formContext.reset()
      setTimeout(() => {
        router.push(navigationRoutes.userAndAccess.user.list)
      }, 500)
    },
    onError: (error: any) => {
      setSnackbarOpen(true)
      const errorMessage = error.message?.toLowerCase() || ""
      if (errorMessage.includes("username") && errorMessage.includes("already exist")) {
        formContext.setError("username", {
          type: "manual",
          message: "Username is already taken"
        })
      }
      if (errorMessage.includes("email") && errorMessage.includes("already exist")) {
        formContext.setError("email", {
          type: "manual",
          message: "Email is already registered"
        })
      }
    }
  })

  const handleCreateUser = (data: CreateUserDto) => {
    createUserMutation.mutate(data)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleOpenPermissionPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorPermissionPopper(event.currentTarget)
  }

  const handleClosePermissionPopover = () => {
    setAnchorPermissionPopper(null)
  }

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
      renderCell: (params) => {
        const permissions = params.row.permissions
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
          severity={createUserMutation.isError ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {createUserMutation.isError
            ? createUserMutation.error.message
            : "User created successfully"}
        </Alert>
      </Snackbar>
      <FormContainer
        formContext={formContext}
        handleSubmit={formContext.handleSubmit(handleCreateUser)}
      >
        <Stack className="overflow-y-scroll" direction="column" spacing={2}>
          <CustomForm.CardForm
            title="Basic Information"
            subheader="Enter username, email, password, and role of the user"
            icon={<PersonIcon />}
          >
            <Stack direction="column" spacing={2}>
              <div>
                <FormLabel className="font-semibold" required htmlFor="email">
                  Username
                </FormLabel>
                <TextFieldElement
                  id="username"
                  type="text"
                  name="username"
                  placeholder="my_username"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  size="small"
                  disabled={createUserMutation.isPending}
                />
              </div>
              <div>
                <FormLabel className="font-semibold" required htmlFor="email">
                  Email
                </FormLabel>
                <TextFieldElement
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  fullWidth
                  variant="outlined"
                  size="small"
                  disabled={createUserMutation.isPending}
                />
              </div>
              <div>
                <FormLabel className="font-semibold" required htmlFor="password">
                  Password
                </FormLabel>
                <TextFieldElement
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required
                  fullWidth
                  variant="outlined"
                  size="small"
                  disabled={createUserMutation.isPending}
                />
              </div>
              <div>
                <FormLabel className="font-semibold" required htmlFor="role">
                  Role
                </FormLabel>
                <SelectElement
                  name="role"
                  id="role"
                  options={roleOptions}
                  required
                  fullWidth
                  variant="outlined"
                  size="small"
                  disabled={createUserMutation.isPending}
                />
              </div>
            </Stack>
          </CustomForm.CardForm>
          <CustomForm.CardForm
            title="Role Assignment"
            subheader="Assign roles to the user"
            icon={<AccessibilityIcon />}
          >
            <Stack direction="column" spacing={2}>
              <div>
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
              </div>
              <Box className="min-h-[250px]">
                <DataGrid
                  rows={permissionGroups?.data || []}
                  columns={columns}
                  loading={isLoadingPermissionGroups}
                  rowCount={permissionGroups?.data?.length || 0}
                  checkboxSelection
                  disableRowSelectionExcludeModel
                  rowSelectionModel={{
                    type: "include",
                    ids: new Set(formContext.watch("permissions") || [])
                  }}
                  onRowSelectionModelChange={(newSelectionModel) => {
                    const ids =
                      newSelectionModel.type === "include"
                        ? Array.from(newSelectionModel.ids)
                        : []
                    formContext.setValue("permissions", ids as string[])
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
          </CustomForm.CardForm>
        </Stack>
        <Stack
          className="absolute bottom-5 right-5"
          direction="row"
          justifyContent="flex-end"
        >
          <Button
            type="submit"
            variant="contained"
            size="small"
            className="mt-4 font-bold"
            startIcon={<AddIcon />}
            loading={createUserMutation.isPending}
            disabled={createUserMutation.isPending || !formContext.formState.isValid}
          >
            Create User
          </Button>
        </Stack>
      </FormContainer>
    </>
  )
}

export default CreateUserPage
