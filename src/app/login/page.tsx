"use client"

import { Visibility, VisibilityOff } from "@mui/icons-material"
import LockPersonIcon from "@mui/icons-material/LockPerson"
import PersonIcon from "@mui/icons-material/Person"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormLabel,
  IconButton,
  InputAdornment,
  Typography
} from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FormContainer, TextFieldElement } from "react-hook-form-mui"
import { LoginDto } from "./_domain/dto/login"
import { loginApi } from "services/auth"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const formContext = useForm<LoginDto>({
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const loginMutation = useMutation({
    mutationFn: (data: LoginDto) => loginApi(data),
    onSuccess: () => {
      //navigate to home page
      router.push("/home")
    }
  })

  const handleLogin = (data: LoginDto) => {
    loginMutation.mutate(data)
  }

  return (
    <Box className="flex items-center justify-center min-h-screen">
      <Card
        variant="outlined"
        className="w-full max-w-md shadow-lg"
        sx={{
          borderRadius: "10px",
          padding: "4px"
        }}
      >
        <CardHeader
          className="text-center"
          title={
            <Typography className="font-bold" variant="h4" component={"h1"}>
              Login to Noheir
            </Typography>
          }
          subheader={
            <Typography variant="body2">
              Please enter your email and password to login
            </Typography>
          }
        />
        <Divider variant="middle" />
        <CardContent className="flex flex-col justify-center gap-10">
          <FormContainer
            formContext={formContext}
            handleSubmit={formContext.handleSubmit(handleLogin)}
          >
            <Box className="space-y-4 h-full flex flex-col justify-center gap-4">
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
                  disabled={loginMutation.isPending}
                  error={loginMutation.isError}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      )
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      marginTop: "8px",
                      borderRadius: "10px",
                      "&.Mui-focused fieldset": {
                        boxShadow: "0 0 0 3px rgba(63, 0, 135, 0.1)"
                      }
                    },
                    "& .MuiOutlinedInput-input::placeholder": {
                      color: "#64748b",
                      opacity: 1
                    }
                  }}
                />
              </div>
              <div>
                <FormLabel className="font-semibold" required htmlFor="password">
                  Password
                </FormLabel>
                <TextFieldElement
                  name="password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  error={loginMutation.isError}
                  disabled={loginMutation.isPending}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockPersonIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword ? "hide the password" : "display the password"
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      marginTop: "8px",
                      borderRadius: "10px",
                      "&.Mui-focused fieldset": {
                        boxShadow: "0 0 0 3px rgba(63, 0, 135, 0.1)"
                      }
                    },
                    "& .MuiOutlinedInput-input::placeholder": {
                      color: "#64748b",
                      opacity: 1
                    }
                  }}
                />
              </div>
            </Box>
            {loginMutation.isError && (
              <Typography variant="body2" color="error">
                Username or password is incorrect
              </Typography>
            )}
            <div className="mt-4">
              <Divider />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="small"
                className="mt-4 font-bold"
                loading={loginMutation.isPending}
                disabled={loginMutation.isPending}
              >
                Login
              </Button>
            </div>
          </FormContainer>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login
