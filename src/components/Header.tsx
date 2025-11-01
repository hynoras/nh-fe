import { AccountCircle } from "@mui/icons-material"
import MenuIcon from "@mui/icons-material/Menu"
import { AppBar, IconButton, Menu, MenuItem, Toolbar } from "@mui/material"
import { useRouter } from "next/navigation"

type HeaderProps = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  drawerWidth: number
}

const Header = ({ sidebarOpen, setSidebarOpen, drawerWidth }: HeaderProps) => {
  const router = useRouter()
  return (
    <AppBar
      position="fixed"
      sx={{
        width: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
        ml: sidebarOpen ? `${drawerWidth}px` : 0,
        transition: (theme) =>
          theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
          })
      }}
    >
      <Toolbar>
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
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          //onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          //anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          open={false}
          // onClose={handleClose}
        >
          <MenuItem onClick={() => router.push("/user")}>Profile</MenuItem>
          <MenuItem onClick={() => router.push("/login")}>My account</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Header
