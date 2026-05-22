"use client"

import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { Box, IconButton, Stack, Typography } from "@mui/material"
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
          <Typography variant="h5">Experiment</Typography>
          <TableToolbar
            filter={experimentListFilter}
            setFilter={setExperimentListFilter}
            searchBar={{
              placeholder: "Search by title"
            }}
            primaryButton={{
              children: "Create Experiment",
              startIcon: <AddIcon />,
              onClick: () => setOpenCreateExperiment(true)
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
