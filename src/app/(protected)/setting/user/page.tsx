"use client"

import { Search } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
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
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { getUserListApi } from "./_service"
import { UserListFilter } from "./_types/user"

const UserPage = () => {
  const [userListFilter, setUserListFilter] = useState<UserListFilter>({
    search: "",
    role: "",
    page: 1,
    pageSize: 10
  })
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

  const router = useRouter()

  const handlePaginationChange = (model: GridPaginationModel) => {
    setUserListFilter((prev) => ({
      ...prev,
      page: model.page + 1,
      pageSize: model.pageSize
    }))
  }

  const columns: GridColDef[] = [
    {
      field: "email",
      headerName: "User",
      flex: 1,
      valueGetter: (_, row) => {
        return `${row.username}-${row.email}`
      },
      renderCell: (params: GridRenderCellParams<any, string>) => {
        const [username, email] = params.value?.split("-") || []
        return (
          <Stack direction={"column"} spacing={1}>
            <Typography variant="body1" color="text" sx={{ height: 20 }}>
              {username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {email}
            </Typography>
          </Stack>
        )
      }
    },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    { field: "updatedAt", headerName: "Updated At", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: () => {
        return (
          <Stack
            direction={"row"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            spacing={2}
          >
            <IconButton>
              <EditIcon />
            </IconButton>
            <IconButton color="error">
              <DeleteIcon />
            </IconButton>
          </Stack>
        )
      }
    }
  ]

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
    router.push("/setting/user/create")
  }

  return (
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
        <Box sx={{ height: "55vh" }}>
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
          />{" "}
        </Box>
      </Stack>
    </Box>
  )
}

export default UserPage
