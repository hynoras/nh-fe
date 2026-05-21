"use client"
import { Add } from "@mui/icons-material"
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"
import ScienceIcon from "@mui/icons-material/Science"
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip
} from "@mui/material"
import { navigationRoutes } from "constants/navigation"
import { useRouter } from "next/navigation"
import { useState } from "react"

type MenuItem = {
  type: "item" | "divider"
  text: string
  icon: React.ReactNode
  navigate: string
}

type Component = "sidebar" | "button"

const getListItems = (componentCategory: Component): MenuItem[] => {
  return [
    {
      type: "item",
      text: "Experiment",
      icon: <ScienceIcon />,
      navigate: componentCategory === "sidebar" ? navigationRoutes.experiment.list : ""
    },
    // {
    //   type: "divider",
    //   text: "",
    //   icon: null,
    //   navigate: ""
    // },
    {
      type: "item",
      text: componentCategory === "sidebar" ? "Users & Access" : "User",
      icon: <ManageAccountsIcon />,
      navigate:
        componentCategory === "sidebar"
          ? navigationRoutes.userAndAccess.user.list
          : navigationRoutes.userAndAccess.user.create
    }
  ]
}

type SidebarProps = {
  open: boolean
  drawerWidth: number
  collapsedWidth: number
}

const Sidebar = ({ open, drawerWidth, collapsedWidth }: SidebarProps) => {
  const router = useRouter()
  const currentWidth = open ? drawerWidth : collapsedWidth
  const [newMenuAnchor, setNewMenuAnchor] = useState<null | HTMLElement>(null)
  const newMenuOpen = Boolean(newMenuAnchor)

  const handleNewClick = (event: React.MouseEvent<HTMLElement>) => {
    setNewMenuAnchor(event.currentTarget)
  }

  const handleNewMenuClose = () => {
    setNewMenuAnchor(null)
  }

  return (
    <Drawer
      sx={{
        width: currentWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: currentWidth,
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen
            })
        }
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar className="min-h-[50px]" />
      <Box className="flex justify-center items-center px-4 py-2">
        {open ? (
          <Button
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<Add />}
            onClick={handleNewClick}
          >
            New
          </Button>
        ) : (
          <IconButton
            color="primary"
            aria-label="New"
            onClick={handleNewClick}
            sx={(theme) => ({
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: "8px"
            })}
          >
            <Add />
          </IconButton>
        )}
      </Box>
      <Menu
        anchorEl={newMenuAnchor}
        open={newMenuOpen}
        onClose={handleNewMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {getListItems("button").map((item: MenuItem) =>
          item.type === "divider" ? (
            <Divider key="divider" />
          ) : (
            <MenuItem
              key={item.text}
              onClick={() => {
                handleNewMenuClose()
                router.push(item.navigate)
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </MenuItem>
          )
        )}
      </Menu>
      <Divider />
      <List>
        {getListItems("sidebar").map((item: MenuItem) =>
          item.type === "divider" ? (
            <Divider key="divider" />
          ) : (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <Tooltip title={!open ? item.text : ""} placement="right" arrow>
                <ListItemButton
                  onClick={() => router.push(item.navigate)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1.5 : "auto",
                      justifyContent: "center"
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          )
        )}
      </List>
    </Drawer>
  )
}

export default Sidebar
