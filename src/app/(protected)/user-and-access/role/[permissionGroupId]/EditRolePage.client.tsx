"use client"

import { Search } from "@mui/icons-material"
import AccessibilityIcon from "@mui/icons-material/Accessibility"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import InfoIcon from "@mui/icons-material/Info"
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
  debounce
} from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import CustomForm from "components/form"
import {
  usePermissionGroupDetail,
  usePermissions,
  useUpdatePermissionGroup
} from "hooks/queries/permission"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui"
import { UpdatePermissionGroupDto } from "../_domain/dto/permission"
import { Permission } from "../_domain/entity/permission"

type OriginalValues = {
  name: string
  description: string
  permissions: string[]
}

const EditRolePageClient = () => {
  const { permissionGroupId } = useParams<{ permissionGroupId: string }>()
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [searchFilter, setSearchFilter] = useState("")
  const [originalValues, setOriginalValues] = useState<OriginalValues>({
    name: "",
    description: "",
    permissions: []
  })
  const [isInitialized, setIsInitialized] = useState(false)

  const router = useRouter()

  // Fetch permission group detail
  const { data: permissionGroupDetail, isLoading: isLoadingDetail } =
    usePermissionGroupDetail(permissionGroupId as string)

  // Fetch all permissions
  const { data: permissions, isLoading: isLoadingPermissions } = usePermissions()

  const filteredPermissions = useMemo(() => {
    if (!permissions?.data) return []
    if (!searchFilter) return permissions.data
    return permissions.data.filter(
      (permission) =>
        permission.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        permission.description?.toLowerCase().includes(searchFilter.toLowerCase())
    )
  }, [permissions?.data, searchFilter])

  const formContext = useForm<UpdatePermissionGroupDto>({
    defaultValues: {
      name: "",
      description: "",
      permissions: []
    },
    mode: "onChange"
  })

  // Initialize form with fetched data
  useEffect(() => {
    if (permissionGroupDetail?.data && !isInitialized) {
      const permissionIds = permissionGroupDetail.data.permissions
        ?.map((p) => p.id)
        .filter(Boolean) as string[]
      const initialValues: OriginalValues = {
        name: permissionGroupDetail.data.name || "",
        description: permissionGroupDetail.data.description || "",
        permissions: permissionIds || []
      }

      formContext.reset({
        name: initialValues.name,
        description: initialValues.description,
        permissions: initialValues.permissions
      })

      setOriginalValues(initialValues)
      setIsInitialized(true)
    }
  }, [permissionGroupDetail, formContext, isInitialized])

  const handleSearch: TextFieldProps["onChange"] = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchFilter(e.target.value)
  }

  const debouncedHandleSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleSearch(e)
    }, 500),
    [handleSearch]
  )

  const watchedPermissions = formContext.watch("permissions")
  const watchedName = formContext.watch("name")
  const watchedDescription = formContext.watch("description")

  // Validate permissions
  useEffect(() => {
    if (!watchedPermissions || watchedPermissions.length === 0) {
      formContext.setError("permissions", {
        type: "manual",
        message: "At least one permission is required"
      })
    } else {
      formContext.clearErrors("permissions")
    }
  }, [watchedPermissions, formContext])

  // Track unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (!isInitialized) return false
    const currentPermissions = watchedPermissions || []
    const nameChanged = watchedName !== originalValues.name
    const descriptionChanged = watchedDescription !== originalValues.description
    const permissionsChanged =
      JSON.stringify([...currentPermissions].sort()) !==
      JSON.stringify([...originalValues.permissions].sort())

    return nameChanged || descriptionChanged || permissionsChanged
  }, [watchedName, watchedDescription, watchedPermissions, originalValues, isInitialized])

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

  const updateRoleMutation = useUpdatePermissionGroup(permissionGroupId as string)

  const handleSave = (data: UpdatePermissionGroupDto) => {
    updateRoleMutation.mutate(data, {
      onSuccess: () => {
        setSnackbarOpen(true)
        // Update original values after successful save
        setOriginalValues({
          name: watchedName || "",
          description: watchedDescription || "",
          permissions: watchedPermissions || []
        })
      },
      onError: (error: any) => {
        setSnackbarOpen(true)
        const errorMessage = error.message?.toLowerCase() || ""
        if (errorMessage.includes("name") && errorMessage.includes("already exist")) {
          formContext.setError("name", {
            type: "manual",
            message: "Role name is already taken"
          })
        }
      }
    })
  }

  const handleDiscard = () => {
    formContext.reset({
      name: originalValues.name,
      description: originalValues.description,
      permissions: originalValues.permissions
    })
    formContext.clearErrors()
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const columns: GridColDef<Permission>[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 0.3
    },
    {
      field: "description",
      headerName: "Description",
      flex: 0.7
    }
  ]

  if (isLoadingDetail) {
    return <div>Loading...</div>
  }

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
          severity={updateRoleMutation.isError ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {updateRoleMutation.isError
            ? updateRoleMutation.error.message
            : "Role updated successfully"}
        </Alert>
      </Snackbar>
      <Stack className="h-[82vh] overflow-y-scroll" direction="column" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={() => router.back()} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Edit Role</Typography>
        </Stack>
        <FormContainer
          formContext={formContext}
          handleSubmit={formContext.handleSubmit(handleSave)}
        >
          <Stack direction="column" spacing={2}>
            <CustomForm.CardForm
              title="Role Details"
              subheader="Enter name and description of the role"
              icon={<InfoIcon />}
            >
              <Stack direction="column" spacing={2}>
                <div>
                  <FormLabel className="font-semibold" required htmlFor="name">
                    Name
                  </FormLabel>
                  <TextFieldElement
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Role name"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                    disabled={updateRoleMutation.isPending}
                    rules={{
                      minLength: {
                        value: 5,
                        message: "Name must be at least 5 characters"
                      },
                      maxLength: {
                        value: 50,
                        message: "Name must not exceed 50 characters"
                      }
                    }}
                  />
                </div>
                <div>
                  <FormLabel className="font-semibold" htmlFor="description">
                    Description
                  </FormLabel>
                  <TextFieldElement
                    id="description"
                    type="text"
                    name="description"
                    placeholder="Role description"
                    fullWidth
                    variant="outlined"
                    size="small"
                    multiline
                    rows={3}
                    disabled={updateRoleMutation.isPending}
                  />
                </div>
              </Stack>
            </CustomForm.CardForm>
            <CustomForm.CardForm
              title="Assign Permissions"
              subheader="Select permissions for this role"
              icon={<AccessibilityIcon />}
            >
              <Stack direction="column" spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    id="outlined-basic"
                    placeholder="Search by name or description"
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
                  {formContext.formState.errors.permissions && (
                    <FormHelperText error>
                      {formContext.formState.errors.permissions.message}
                    </FormHelperText>
                  )}
                </Stack>
                <Box className="h-[60vh]">
                  <DataGrid
                    rows={filteredPermissions}
                    columns={columns}
                    loading={isLoadingPermissions}
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
                      formContext.setValue("permissions", ids as string[], {
                        shouldValidate: true,
                        shouldDirty: true
                      })
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
            spacing={1}
          >
            <Button
              variant="outlined"
              size="small"
              className="mt-4 font-bold"
              onClick={handleDiscard}
              disabled={!hasUnsavedChanges}
            >
              Discard
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="small"
              className="mt-4 font-bold"
              disabled={
                !hasUnsavedChanges ||
                updateRoleMutation.isPending ||
                !formContext.formState.isValid ||
                !!formContext.formState.errors.permissions
              }
              loading={updateRoleMutation.isPending}
            >
              Save
            </Button>
          </Stack>
        </FormContainer>
      </Stack>
    </>
  )
}

export default EditRolePageClient
