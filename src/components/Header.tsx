"use client"
import { AccountCircle, Logout, Settings } from "@mui/icons-material"
import MenuIcon from "@mui/icons-material/Menu"
import {
  AppBar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography
} from "@mui/material"
import { useGetIdentity } from "@refinedev/core"
import { useMutation } from "@tanstack/react-query"
import { User } from "domain/user/user.entity"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { logoutApi } from "services/auth.service"

type HeaderProps = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const { data: identity } = useGetIdentity<User>()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const router = useRouter()
  const logoutMutation = useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      router.push("/login")
    }
  })
  const open = Boolean(anchorEl)

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        height: 50,
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar className="flex justify-between items-center min-h-[50px]">
        <IconButton
          edge="start"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <MenuIcon fontSize="large" />
        </IconButton>
        <Stack direction="row" alignItems="center" gap={2}>
          <IconButton
            edge="end"
            aria-controls={open ? "setting-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleOpenMenu}
          >
            <AccountCircle fontSize="large" />
          </IconButton>
        </Stack>
        <Menu id="setting-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem>
            <Stack direction="column">
              <Typography variant="h6">{identity?.username}</Typography>
              <Typography variant="body1">{identity?.email}</Typography>
            </Stack>
          </MenuItem>
          <Divider variant="middle" />
          <MenuItem onClick={() => router.push("/setting")}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider variant="middle" />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="medium" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Header
