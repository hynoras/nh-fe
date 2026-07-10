"use client"

import { Google, Visibility, VisibilityOff } from "@mui/icons-material"
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
import { authPaths } from "constants/api"
import { OAuthProvider } from "constants/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { FormContainer, TextFieldElement } from "react-hook-form-mui"
import { loginApi } from "services/auth.service"
import { LoginDto } from "../../domain/auth/auth.dto"

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

  const handleGoogleLogin = () => {
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    window.open(
      `api/${authPaths.providerLogin(OAuthProvider.GOOGLE)}`,
      "google-login",
      `width=${width},height=${height},left=${left},top=${top}`
    )
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "LOGIN_SUCCESS") {
        router.push("/home")
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [router])

  return (
    <Box
      className="flex items-center justify-center min-h-screen"
      sx={(theme) => ({
        background: `radial-gradient(
          circle at top,
          rgba(63, 0, 135, 0.12) 0%,
          transparent 38%
        ),
        radial-gradient(
          ellipse at center,
          #F7F7F8 0%,
          rgba(63, 0, 135, 0.12) 40%
        )`,
        ...theme.applyStyles("dark", {
          background: `radial-gradient(
            circle at top,
            rgba(109, 94, 246, 0.12) 0%,
            transparent 38%
          ),
          radial-gradient(
            ellipse at center,
            #000 0%,
            rgba(109, 94, 246, 0.05) 80%
          )`
        })
      })}
    >
      <Card
        className="w-full max-w-md"
        sx={{
          padding: "36px 36px"
        }}
      >
        <CardHeader
          className="text-center"
          sx={{ p: 0, pb: "24px" }}
          title={
            <>
              <Typography className="font-semibold" variant="h4">
                Noheir
              </Typography>
              <Typography className="font-medium mb-4" variant="body1">
                Scientific Workflow Platform
              </Typography>
            </>
          }
          subheader={<Typography variant="subtitle2">Sign in to continue</Typography>}
        />
        <Divider />
        <CardContent
          className="flex flex-col justify-center pt-4"
          sx={{ p: 0, "&:last-child": { pb: 0 } }}
        >
          <FormContainer
            formContext={formContext}
            handleSubmit={formContext.handleSubmit(handleLogin)}
          >
            <Box className="flex flex-col justify-center gap-[28px]">
              <div className="flex flex-col gap-[10px]">
                <FormLabel className="font-semibold" htmlFor="email">
                  Email
                </FormLabel>
                <TextFieldElement
                  className="border-[#2B2B2B]"
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
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <FormLabel className="font-semibold" htmlFor="password">
                  Password
                </FormLabel>
                <TextFieldElement
                  className="border-[#2B2B2B]"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
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
                />
              </div>
            </Box>
            {loginMutation.isError && (
              <Typography variant="body2" color="error">
                Username or password is incorrect
              </Typography>
            )}
            <div className="mt-12">
              <Button
                className="font-bold text-base normal-case"
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                loading={loginMutation.isPending}
                disabled={loginMutation.isPending}
              >
                Sign In
              </Button>
            </div>
          </FormContainer>
          <Divider className="my-4">
            <Typography variant="subtitle2">Or</Typography>
          </Divider>
          <Button
            className="text-base normal-case"
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<Google />}
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login
