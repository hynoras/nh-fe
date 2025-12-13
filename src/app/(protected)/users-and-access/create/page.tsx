"use client"

import AddIcon from "@mui/icons-material/Add"
import PersonIcon from "@mui/icons-material/Person"
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormLabel,
  Snackbar,
  Stack
} from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
  useForm
} from "react-hook-form-mui"
import { CreateUserDto } from "../_domain/dto/user"
import { createUserApi } from "../_service"

const CreateUserPage = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()
  const formContext = useForm<CreateUserDto>({
    defaultValues: {
      username: "",
      email: "",
      password: "CHANGETHISAFTERWARDS",
      role: "user"
    }
  })

  const roleOptions = [
    { label: "User", id: "user" },
    { label: "Admin", id: "admin" }
  ]

  const createUserMutation = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setSnackbarOpen(true)
      formContext.reset()
      setTimeout(() => {
        router.push("/setting/user")
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
        <Box className="h-[60vh] overflow-y-auto">
          <Card variant="outlined">
            <CardHeader
              avatar={
                <Avatar>
                  <PersonIcon />
                </Avatar>
              }
              title="Basic Information"
              subheader="Enter username, email, password, and role of the user"
            />
            <CardContent>
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
                    autoFocus
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
                    autoFocus
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
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                    disabled={createUserMutation.isPending}
                  />
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Box>
        <Stack direction="row" justifyContent="flex-end">
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
