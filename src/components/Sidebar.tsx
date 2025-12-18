import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography
} from "@mui/material"
import { navigationRoutes } from "consts/navigation"
import { useRouter } from "next/navigation"

type MenuItem = {
  text: string
  icon: React.ReactNode
  navigate: string
}

const menuItems: MenuItem[] = [
  {
    text: "Users & Access",
    icon: <ManageAccountsIcon />,
    navigate: navigationRoutes.userAndAccess.user.list
  }
]

type SidebarProps = {
  open: boolean
  drawerWidth: number
}

const Sidebar = ({ open, drawerWidth }: SidebarProps) => {
  const router = useRouter()

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box"
        }
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <List>
        {menuItems.map((item: MenuItem) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => router.push(item.navigate)}>
              <Stack direction="row" alignItems="center" gap={1}>
                {item.icon}
                <Typography variant="body2">{item.text}</Typography>
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  )
}

export default Sidebar
