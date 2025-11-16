"use client"

import { Search } from "@mui/icons-material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Select,
  Stack,
  TextField
} from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { getUserListApi } from "./_service"
import { UserListFilter } from "./types/user"

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
      )
  })

  const columns: GridColDef[] = [
    { field: "email", headerName: "Email", flex: 1 },
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
            <Select size="small" label="Select Role"></Select>
          </Stack>
          <Button variant="contained" color="primary">
            Create User
          </Button>
        </Stack>
        <Box sx={{ height: "60vh" }}>
          <DataGrid rows={usersData?.data || []} columns={columns} loading={isLoading} />
        </Box>
      </Stack>
    </Box>
  )
}

export default UserPage
