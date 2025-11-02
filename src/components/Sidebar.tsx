import { Drawer } from "@mui/material"

type SidebarProps = {
  open: boolean
  drawerWidth: number
}

const Sidebar = ({ open, drawerWidth }: SidebarProps) => {
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
      abc
    </Drawer>
  )
}

export default Sidebar
