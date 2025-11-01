import { AccountCircle } from "@mui/icons-material"
import MenuIcon from "@mui/icons-material/Menu"
import { AppBar, IconButton, Menu, MenuItem, Toolbar } from "@mui/material"
import { useRouter } from "next/navigation"

export default function Header() {
  const router = useRouter()
  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between">
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <div>
          <IconButton
            size="large"
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
        </div>
      </Toolbar>
    </AppBar>
  )
}
