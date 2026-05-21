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
  Toolbar,
  Tooltip
} from "@mui/material"
import { navigationRoutes } from "constants/navigation"
import { useRouter } from "next/navigation"

type MenuItem = {
  type: "item" | "divider"
  text: string
  icon: React.ReactNode
  navigate: string
}

const menuItems: MenuItem[] = [
  {
    type: "item",
    text: "Experiment",
    icon: <ScienceIcon />,
    navigate: navigationRoutes.experiment.list
  },
  {
    type: "divider",
    text: "",
    icon: null,
    navigate: ""
  },
  {
    type: "item",
    text: "Users & Access",
    icon: <ManageAccountsIcon />,
    navigate: navigationRoutes.userAndAccess.user.list
  }
]

type SidebarProps = {
  open: boolean
  drawerWidth: number
  collapsedWidth: number
}

const Sidebar = ({ open, drawerWidth, collapsedWidth }: SidebarProps) => {
  const router = useRouter()
  const currentWidth = open ? drawerWidth : collapsedWidth

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
          <Button variant="outlined" size="large" fullWidth startIcon={<Add />}>
            New
          </Button>
        ) : (
          <IconButton
            color="primary"
            aria-label="New"
            onClick={() => {}}
            sx={(theme) => ({
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: "8px"
            })}
          >
            <Add />
          </IconButton>
        )}
      </Box>
      <Divider />
      <List>
        {menuItems.map((item: MenuItem) =>
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
