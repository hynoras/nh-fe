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
import CustomForm from "components/form"
import { navigationRoutes } from "consts/navigation"
import { useCreateUser, usePermissionGroups } from "hooks/queries/user"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui"
import { Permission } from "../../role/_domain/entity/permission"
import { CreateUserDto } from "../_domain/dto/user"
import { PermissionGroupListFilter } from "../_types/user"

const CreateUserPageClient = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [anchorPermissionPopper, setAnchorPermissionPopper] =
    useState<null | HTMLElement>(null)

  const router = useRouter()

  const open = Boolean(anchorPermissionPopper)

  const [permissionGroupFilter, setPermissionGroupFilter] =
    useState<PermissionGroupListFilter>({
      search: "",
      page: 1,
      pageSize: 100
    })

  const { data: permissionGroups, isLoading: isLoadingPermissionGroups } =
    usePermissionGroups(permissionGroupFilter)

  const formContext = useForm<CreateUserDto>({
    defaultValues: {
      username: "",
      email: "",
      password: "CHANGETHISAFTERWARDS",
      permissions: []
    }
  })

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

  const createUserMutation = useCreateUser()

  const handleCreateUser = (data: CreateUserDto) => {
    createUserMutation.mutate(data, {
      onSuccess: () => {
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              overflow: "hidden"
            }}
          >
            {permissions.slice(0, 3).map((item: Permission) => (
              <Chip key={item.id} label={item.name} size="small" />
            ))}
            {permissions.length > 3 && (
              <Chip
                label={`+${permissions.length - 3}`}
                size="small"
                onMouseEnter={handleOpenPermissionPopover}
                onMouseLeave={handleClosePermissionPopover}
              />
            )}
          </Box>
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
                <FormLabel className="font-semibold" required htmlFor="username">
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

export default CreateUserPageClient
