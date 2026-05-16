"use client"

import { Search } from "@mui/icons-material"
import AccessibilityIcon from "@mui/icons-material/Accessibility"
import AddIcon from "@mui/icons-material/Add"
import InfoIcon from "@mui/icons-material/Info"
import {
  Box,
  Button,
  FormHelperText,
  FormLabel,
  InputAdornment,
  Stack,
  TextField,
  TextFieldProps,
  debounce
} from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import CustomForm from "components/form"
import { navigationRoutes } from "consts/navigation"
import { useCreatePermissionGroup, usePermissions } from "hooks/queries/permission"
import { useNotification } from "hooks/notification"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui"
import { CreatePermissionGroupDto } from "../_domain/dto/permission"
import { Permission } from "../_domain/entity/permission"

const CreateRolePageClient = () => {
  const [searchFilter, setSearchFilter] = useState("")

  const router = useRouter()
  const { notify } = useNotification()

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

  const formContext = useForm<CreatePermissionGroupDto>({
    defaultValues: {
      name: "",
      description: "",
      permissions: []
    },
    mode: "onChange"
  })

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

  const createRoleMutation = useCreatePermissionGroup()

  const handleCreateRole = (data: CreatePermissionGroupDto) => {
    createRoleMutation.mutate(data, {
      onSuccess: () => {
        notify("Role created successfully", "success")
        formContext.reset()
        setTimeout(() => {
          router.push(navigationRoutes.userAndAccess.role.list)
        }, 500)
      },
      onError: (error: any) => {
        notify(error.message, "error")
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

  return (
    <>
      <FormContainer
        formContext={formContext}
        handleSubmit={formContext.handleSubmit(handleCreateRole)}
      >
        <Stack className="overflow-y-scroll" direction="column" spacing={2}>
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
                  disabled={createRoleMutation.isPending}
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
                  disabled={createRoleMutation.isPending}
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
                  rowCount={filteredPermissions.length}
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
        >
          <Button
            type="submit"
            variant="contained"
            size="small"
            className="mt-4 font-bold"
            startIcon={<AddIcon />}
            loading={createRoleMutation.isPending}
            disabled={
              createRoleMutation.isPending ||
              !formContext.formState.isValid ||
              !!formContext.formState.errors.permissions
            }
          >
            Create Role
          </Button>
        </Stack>
      </FormContainer>
    </>
  )
}

export default CreateRolePageClient
