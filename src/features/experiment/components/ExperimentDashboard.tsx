"use client"

import { Cancel, CheckCircle, Circle } from "@mui/icons-material"
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  Skeleton,
  Stack,
  Typography
} from "@mui/material"
import { GridPaginationModel } from "@mui/x-data-grid"
import TableToolbar from "components/filter/TableToolbar"
import Popup from "components/popup"
import { navigationRoutes } from "constants/navigation"
import { formatDistanceToNow } from "date-fns"
import { useNotification } from "hooks/notification"
import { useDeleteExperiment, useExperimentList } from "hooks/queries/experiment"
import { useResponsiveHeight } from "hooks/responsive"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { useModalStore } from "stores/modal"
import {
  Experiment,
  ExperimentStatus
} from "../../../domain/experiment/experiment.entity"
import { ExperimentListFilter } from "../types/experiment"

const ExperimentListHeader = ({
  isLoading,
  totalExperiments,
  runningExperiments,
  setOpenCreateExperiment
}: {
  isLoading: boolean
  totalExperiments: number
  runningExperiments: number
  setOpenCreateExperiment: (open: boolean) => void
}) => {
  if (isLoading) {
    return (
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          <Skeleton variant="rounded" width={120} height={36} />
          <Skeleton variant="rounded" width={120} height={36} />
        </Stack>
        <Skeleton variant="rounded" width={160} height={36} />
      </Stack>
    )
  }

  return (
    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
      <Stack direction={"row"} alignItems={"center"} spacing={2}>
        <Chip
          label={`${totalExperiments} experiments`}
          color="secondary"
          variant="outlined"
        />
        <Chip
          label={`${runningExperiments} running`}
          color="secondary"
          variant="outlined"
        />
      </Stack>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => setOpenCreateExperiment(true)}
      >
        Create Experiment
      </Button>
    </Stack>
  )
}

const ExperimentCardItem = ({ experiment }: { experiment: Experiment }) => {
  const router = useRouter()

  const formatCreatedAtDistance = experiment.createdAt
    ? formatDistanceToNow(new Date(experiment.createdAt), {
        addSuffix: true
      })
    : "Unknown time"

  const formatStartedAtDistance = experiment.startedAt
    ? formatDistanceToNow(new Date(experiment.startedAt), {
        addSuffix: true
      })
    : "Unknown time"

  const handleEditExperiment = (experimentId: string) => {
    router.push(navigationRoutes.experiment.detail(experimentId))
  }

  const getStatusColor = (status: ExperimentStatus) => {
    switch (status) {
      case ExperimentStatus.RUNNING:
        return "info"
      case ExperimentStatus.COMPLETED:
        return "success"
      case ExperimentStatus.ABORTED:
        return "default"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: ExperimentStatus) => {
    switch (status) {
      case ExperimentStatus.RUNNING:
        return <Circle />
      case ExperimentStatus.COMPLETED:
        return <CheckCircle />
      case ExperimentStatus.ABORTED:
        return <Cancel />
      default:
        return
    }
  }

  return (
    <Card className="w-full mb-4">
      <CardActionArea onClick={() => handleEditExperiment(experiment.id as string)}>
        <CardContent className="flex flex-col gap-4">
          <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
            <Typography variant="h5">{experiment.title}</Typography>
            <Chip
              label={experiment.status}
              icon={getStatusIcon(experiment.status as ExperimentStatus)}
              size="small"
              variant="outlined"
              color={getStatusColor(experiment.status as ExperimentStatus)}
            />
          </Stack>
          <Typography variant="subtitle1">{experiment.objective}</Typography>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Chip variant="outlined" label={experiment.type} />
            <Typography variant="subtitle2">
              {`Created ${formatCreatedAtDistance}`}
            </Typography>
            {experiment.status === ExperimentStatus.RUNNING && (
              <Typography variant="subtitle2">
                {`Started ${formatStartedAtDistance}`}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

const ExperimentDashboard = () => {
  const setOpenCreateExperiment = useModalStore((state) => state.setOpenCreateExperiment)
  const { notify } = useNotification()

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null)
  const [experimentListFilter, setExperimentListFilter] = useState<ExperimentListFilter>({
    search: "",
    page: 1,
    pageSize: 10
  })

  const {
    data: experimentsData,
    isLoading,
    refetch
  } = useExperimentList(experimentListFilter)
  const deleteExperimentMutation = useDeleteExperiment()

  const tableRef = useRef<HTMLDivElement>(null)
  const tableHeight = useResponsiveHeight(tableRef)

  const handlePaginationChange = (model: GridPaginationModel) => {
    setExperimentListFilter((prev) => ({
      ...prev,
      page: model.page + 1,
      pageSize: model.pageSize
    }))
  }

  const handleClickOpen = (experiment: Experiment) => {
    setSelectedExperiment(experiment)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setSelectedExperiment(null)
  }

  const handleRefreshButton = async () => {
    await refetch()
  }

  const handleDeleteExperiment = () => {
    if (selectedExperiment) {
      deleteExperimentMutation.mutate(selectedExperiment.id as string, {
        onSuccess: () => {
          handleCloseDeleteDialog()
          notify("Experiment deleted successfully", "success")
        },
        onError: (error) => {
          notify(error.message, "error")
          console.error(error)
        }
      })
    }
  }

  return (
    <>
      <Popup.DeleteConfirmation
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        instance={{ name: selectedExperiment?.title || "", type: "experiment" }}
        handleDelete={handleDeleteExperiment}
      />
      <Box sx={{ width: "100%" }}>
        <Stack direction={"column"} spacing={2}>
          <ExperimentListHeader
            isLoading={isLoading}
            totalExperiments={experimentsData?.length || 0}
            runningExperiments={
              experimentsData?.data?.filter(
                (experiment) => experiment.status === ExperimentStatus.RUNNING
              ).length || 0
            }
            setOpenCreateExperiment={setOpenCreateExperiment}
          />
          <Divider />
          <TableToolbar
            filter={experimentListFilter}
            setFilter={setExperimentListFilter}
            searchBar={{
              placeholder: "Search by title"
            }}
            refreshButton={{
              show: true,
              iconOnly: true,
              onClick: handleRefreshButton
            }}
          />
          <Box sx={{ height: tableHeight }} ref={tableRef}>
            <List>
              {experimentsData?.data?.map((experiment) => (
                <ListItem key={experiment.id} disablePadding>
                  <ExperimentCardItem experiment={experiment} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Stack>
      </Box>
    </>
  )
}

export default ExperimentDashboard
