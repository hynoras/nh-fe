"use client"
import { AccountCircle, Logout, Settings } from "@mui/icons-material"
import MenuIcon from "@mui/icons-material/Menu"
import { AppBar, IconButton, ListItemIcon, Menu, MenuItem, Toolbar } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { logoutApi } from "app/login/_service"
import { useRouter } from "next/navigation"
import { useState } from "react"

type HeaderProps = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  drawerWidth: number
}

const Header = ({ sidebarOpen, setSidebarOpen, drawerWidth }: HeaderProps) => {
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
        width: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
        height: 50,
        ml: sidebarOpen ? `${drawerWidth}px` : 0,
        transition: (theme) =>
          theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
          })
      }}
    >
      <Toolbar className="flex justify-between items-center min-h-[50px]">
        <IconButton
          size="small"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          size="small"
          edge="end"
          aria-controls={open ? "setting-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleOpenMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu id="setting-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={() => router.push("/setting")}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Header
