"use client"

import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography
} from "@mui/material"
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams
} from "@mui/x-data-grid"
import TableToolbar from "components/filter/TableToolbar"
import Popup from "components/popup"
import { navigationRoutes } from "constants/navigation"
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
import ExperimentStatusDisplay from "./ExperimentStatusDisplay"

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

const ExperimentDashboard = () => {
  const setOpenCreateExperiment = useModalStore((state) => state.setOpenCreateExperiment)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null)
  const [experimentListFilter, setExperimentListFilter] = useState<ExperimentListFilter>({
    search: "",
    page: 1,
    pageSize: 10
  })
  const tableRef = useRef<HTMLDivElement>(null)
  const tableHeight = useResponsiveHeight(tableRef)

  const { data: experimentsData, isLoading } = useExperimentList(experimentListFilter)

  const deleteExperimentMutation = useDeleteExperiment()
  const router = useRouter()
  const { notify } = useNotification()

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

  const handleEditExperiment = (experimentId: string) => {
    router.push(navigationRoutes.experiment.detail(experimentId))
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

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      sortable: true,
      resizable: true,
      flex: 0.6,
      renderCell: (params: GridRenderCellParams<Experiment, string>) => {
        return (
          <Stack
            height={"100%"}
            direction={"row"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            spacing={1}
          >
            <ExperimentStatusDisplay
              status={params.row.status || ExperimentStatus.DRAFT}
            />
            <Typography variant="body2" color="textSecondary">
              {params.value}
            </Typography>
          </Stack>
        )
      }
    },
    {
      field: "type",
      headerName: "Type",
      sortable: false,
      resizable: false,
      flex: 0.4
    },
    {
      field: "objective",
      headerName: "Objective",
      sortable: false,
      resizable: false,
      flex: 0.6
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      sortable: false,
      resizable: false,
      renderCell: (params: GridRenderCellParams<Experiment, string>) => {
        return (
          <Stack
            height={"100%"}
            direction={"row"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            spacing={2}
          >
            <IconButton onClick={() => handleEditExperiment(params.row.id as string)}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleClickOpen(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        )
      }
    }
  ]

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
          />
          <Box sx={{ height: tableHeight }} ref={tableRef}>
            <DataGrid
              rows={experimentsData?.data || []}
              columns={columns}
              loading={isLoading}
              paginationMode="server"
              rowCount={experimentsData?.length || 0}
              paginationModel={{
                page: (experimentListFilter?.page || 1) - 1,
                pageSize: experimentListFilter?.pageSize || 10
              }}
              onPaginationModelChange={handlePaginationChange}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              sx={{
                border: 0
              }}
            />
          </Box>
        </Stack>
      </Box>
    </>
  )
}

export default ExperimentDashboard
