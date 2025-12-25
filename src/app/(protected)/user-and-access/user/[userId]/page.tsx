"use client"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import DeleteIcon from "@mui/icons-material/Delete"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar"
import PersonIcon from "@mui/icons-material/Person"
import {
  Alert,
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography
} from "@mui/material"
import { useGetIdentity } from "@refinedev/core"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Popup from "components/popup"
import State from "components/state"
import { navigationRoutes } from "consts/navigation"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { deleteUserApi, getUserDetailApi } from "service/user"
import { a11yProps } from "utils/accessibility"
import { PermissionCode } from "../../role/_const/permission"
import Profile from "../_components/Profile"
import RoleAndPermission from "../_components/RoleAndPermission"
import { User } from "../_domain/entity/user"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

const UserDetailPage = () => {
  const { userId } = useParams<{ userId: string }>()
  const router = useRouter()

  const { data: identity } = useGetIdentity<User>()

  const queryClient = useQueryClient()

  const { data: userDetail } = useQuery({
    queryKey: ["userDetail", userId as string],
    queryFn: () => getUserDetailApi(userId as string)
  })

  // Tab state
  const [value, setValue] = useState<number>(0)

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)

  // Delete dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState<{
    type: "success" | "error"
    message: string
  }>({ type: "success", message: "" })

  // Delete mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string[]) => deleteUserApi(userId),
    onSuccess: () => {
      setOpenDeleteDialog(false)
      setSnackbarMessage({
        type: "success",
        message: "User deleted successfully"
      })
      setSnackbarOpen(true)
      queryClient.invalidateQueries({ queryKey: ["users"] })
      // Navigate to user list page after a short delay
      setTimeout(() => {
        router.push(navigationRoutes.userAndAccess.user.list)
      }, 1500)
    },
    onError: (error: any) => {
      setSnackbarMessage({
        type: "error",
        message: error.message || "Failed to delete user"
      })
      setSnackbarOpen(true)
    }
  })

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Delete handlers
  const handleDeleteClick = () => {
    handleMenuClose()
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  const handleDeleteUser = () => {
    if (userDetail?.data?.id) {
      deleteUserMutation.mutate([userDetail.data.id])
    }
  }

  // Snackbar handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
    setSnackbarMessage({ type: "success", message: "" })
  }

  // Tab handler
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  if (identity && !identity.permissionCodes?.includes(PermissionCode.USER_MANAGE)) {
    return (
      <State.Forbidden description="Only users with permission to manage user can access this page." />
    )
  }

  return (
    <>
      <Popup.DeleteConfirmation
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        instance={{ name: userDetail?.data?.username || "", type: "user" }}
        handleDelete={handleDeleteUser}
      />
      <Stack className="h-[82vh] overflow-y-scroll" direction="column">
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar>
              <PersonIcon />
            </Avatar>
            <Typography variant="h5">{userDetail?.data?.username}</Typography>
          </Stack>
          <IconButton
            aria-controls={menuOpen ? "user-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? "true" : undefined}
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
          >
            <MenuItem onClick={handleDeleteClick}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              Delete this user
            </MenuItem>
          </Menu>
        </Stack>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="user tabs">
            <Tab
              icon={<PermContactCalendarIcon />}
              iconPosition="start"
              label="Profile"
              {...a11yProps(0)}
            />
            <Tab
              icon={<AdminPanelSettingsIcon />}
              iconPosition="start"
              label="Roles & Permissions"
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        {/* Tab Panels */}
        <TabPanel value={value} index={0}>
          <Profile />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <RoleAndPermission />
        </TabPanel>
      </Stack>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarMessage.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default UserDetailPage
