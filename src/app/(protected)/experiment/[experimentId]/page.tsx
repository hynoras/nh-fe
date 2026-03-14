"use client"
import EditIcon from "@mui/icons-material/Edit"
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material"
import {
  useExperimentDetail,
  useUpdateExperiment,
  useUpdateStatusExperiment
} from "hooks/queries/experiment"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { a11yProps } from "utils/accessibility"
import ExperimentStatusDisplay from "../_components/ExperimentStatusDisplay"
import { statusMetadata } from "../_const/experiment"
import { UpdateExperimentDto, UpdateExperimentStatusDto } from "../_domain/dto/experiment"
import { Experiment, ExperimentStatus } from "../_domain/entity/experiment"
import { StatusTransitionMetadata } from "../_types/experiment"
import GeneralPage from "./GeneralPage"

const renderStatusMetadata = (status: ExperimentStatus): StatusTransitionMetadata[] => {
  switch (status) {
    case ExperimentStatus.DRAFT:
      return [statusMetadata[ExperimentStatus.PLANNING]]
    case ExperimentStatus.PLANNING:
      return [statusMetadata[ExperimentStatus.RUNNING]]
    case ExperimentStatus.RUNNING:
      return [
        statusMetadata[ExperimentStatus.COMPLETED],
        statusMetadata[ExperimentStatus.ABORTED]
      ]
    default:
      return []
  }
}

type TransitionStatusConfirmationProps = {
  selectedStatus: ExperimentStatus
  experiment: Experiment
  open: boolean
  onClose: () => void
  onConfirm: (data: UpdateExperimentStatusDto) => void
}

const TransitionStatusConfirmation = ({
  selectedStatus,
  experiment,
  open,
  onClose,
  onConfirm
}: TransitionStatusConfirmationProps) => {
  const handleConfirm = () => {
    onConfirm({ status: selectedStatus, version: experiment?.version || 1 })
    onClose()
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{statusMetadata[selectedStatus].notification.title}</DialogTitle>
      <DialogContent>{statusMetadata[selectedStatus].notification.message}</DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          {statusMetadata[selectedStatus].buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

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
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

// Tab name mapping
const TAB_NAMES = ["general", "procedure"] as const
type TabName = (typeof TAB_NAMES)[number]

const getTabIndexFromName = (name: string | null): number => {
  if (!name) return 0
  const index = TAB_NAMES.indexOf(name as TabName)
  return index === -1 ? 0 : index
}

const ExperimentDetailPage = () => {
  const params = useParams<{ experimentId: string }>()
  const experimentId = params.experimentId
  const { data: experiment, isLoading } = useExperimentDetail(experimentId)
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateExperimentMutation = useUpdateExperiment(experimentId)
  const updateExperimentStatusMutation = useUpdateStatusExperiment(experimentId)

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [titleValue, setTitleValue] = useState<string>("")
  const [open, setOpen] = useState<boolean>(false)
  const [transitionStatuses, setTransitionStatuses] = useState<ExperimentStatus[]>([])
  const [selectedStatus, setSelectedStatus] = useState<ExperimentStatus>(
    ExperimentStatus.DRAFT
  )

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState<{
    type: "success" | "error"
    message: string
  }>({ type: "success", message: "" })

  const [value, setValue] = useState<number>(() => {
    const tabParam = searchParams.get("tab")
    return getTabIndexFromName(tabParam)
  })

  const handleSetTransitionStatuses = (status: ExperimentStatus) => {
    switch (status) {
      case ExperimentStatus.DRAFT:
        setTransitionStatuses([ExperimentStatus.PLANNING])
        break
      case ExperimentStatus.PLANNING:
        setTransitionStatuses([ExperimentStatus.RUNNING])
        break
      case ExperimentStatus.RUNNING:
        setTransitionStatuses([ExperimentStatus.COMPLETED, ExperimentStatus.ABORTED])
        break
      default:
        setTransitionStatuses([])
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
    setSnackbarMessage({ type: "success", message: "" })
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value)
  }

  const handleOnBlur = () => {
    setIsEditing(false)
    setTitleValue(experiment?.data?.title || "")
  }

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleUpdateExperiment({ title: (e.target as HTMLInputElement).value })
    }
    if (e.key === "Escape") {
      setIsEditing(false)
      setTitleValue(experiment?.data?.title || "")
    }
  }

  const handleClickOpen = (key: ExperimentStatus) => {
    setSelectedStatus(key)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleUpdateExperiment = (data: UpdateExperimentDto) => {
    updateExperimentMutation.mutate(data, {
      onSuccess: () => {
        setIsEditing(false)
        setSnackbarMessage({
          type: "success",
          message: "Experiment title renamed successfully"
        })
        setSnackbarOpen(true)
      },
      onError: (error: any) => {
        setSnackbarMessage({
          type: "error",
          message: error.message || "Failed to rename experiment title"
        })
        setSnackbarOpen(true)
      }
    })
  }

  const handleUpdateExperimentStatus = (data: UpdateExperimentStatusDto) => {
    updateExperimentStatusMutation.mutate(data, {
      onSuccess: () => {
        setIsEditing(false)
        setSnackbarMessage({
          type: "success",
          message: "Experiment status updated successfully"
        })
        setSnackbarOpen(true)
      },
      onError: (error: any) => {
        setSnackbarMessage({
          type: "error",
          message: error.message || "Failed to update experiment status"
        })
        setSnackbarOpen(true)
      }
    })
  }

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    const tabName = TAB_NAMES[newValue]
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tabName)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    const tabParam = searchParams.get("tab")
    const tabIndex = getTabIndexFromName(tabParam)
    if (tabIndex !== value) {
      setValue(tabIndex)
    }
  }, [searchParams, value])

  useEffect(() => {
    setTitleValue(experiment?.data?.title || "")
    handleSetTransitionStatuses(experiment?.data?.status || ExperimentStatus.DRAFT)
  }, [experiment])

  return (
    <>
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
      <TransitionStatusConfirmation
        selectedStatus={selectedStatus}
        experiment={experiment?.data || {}}
        open={open}
        onConfirm={handleUpdateExperimentStatus}
        onClose={handleClose}
      />
      <Stack className="h-[82vh]" direction="column">
        {/* Header */}
        {isLoading ? (
          <Stack
            direction={"row"}
            spacing={2}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              <Skeleton variant="text" width={300} height={32} />
              <Skeleton variant="rounded" width={80} height={24} />
            </Stack>
            <Skeleton variant="rounded" width={120} height={24} />
          </Stack>
        ) : (
          <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
            <Stack direction={"row"} spacing={2}>
              {isEditing ? (
                <TextField
                  value={titleValue}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                  onKeyDown={handleOnKeyDown}
                  autoFocus
                  variant="outlined"
                  size="small"
                  disabled={updateExperimentMutation.isPending}
                />
              ) : (
                <>
                  <Typography variant="h5" fontWeight="bold">
                    {experiment?.data?.title}
                  </Typography>
                  <ExperimentStatusDisplay
                    status={experiment?.data?.status || ExperimentStatus.DRAFT}
                    size="medium"
                    isChip
                  />
                  <IconButton size="small" onClick={() => setIsEditing(true)}>
                    <EditIcon />
                  </IconButton>
                </>
              )}
            </Stack>
            <Button
              className="normal-case"
              variant="outlined"
              onClick={() => handleClickOpen(transitionStatuses[0])}
            >
              {
                renderStatusMetadata(
                  experiment?.data?.status || ExperimentStatus.DRAFT
                )[0].buttonText
              }
            </Button>
          </Stack>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          {isLoading ? (
            <Stack direction="row" spacing={2}>
              <Skeleton variant="text" width={100} height={48} />
              <Skeleton variant="text" width={100} height={48} />
            </Stack>
          ) : (
            <Tabs value={value} onChange={handleChange} aria-label="experiment tabs">
              <Tab className="normal-case" label="General" {...a11yProps(0)} />
              <Tab className="normal-case" label="Procedure" {...a11yProps(1)} />
            </Tabs>
          )}
        </Box>

        <TabPanel value={value} index={0}>
          <GeneralPage />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography variant="h6">Procedure</Typography>
        </TabPanel>
      </Stack>
    </>
  )
}

export default ExperimentDetailPage
