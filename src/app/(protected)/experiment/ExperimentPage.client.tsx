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
import { navigationRoutes } from "consts/navigation"
import { format } from "date-fns"
import {
  useCreateExperiment,
  useDeleteExperiment,
  useExperimentList
} from "hooks/queries/experiment"
import { useNotification } from "hooks/notification"
import { useResponsiveHeight } from "hooks/responsive"
import { useRouter } from "next/navigation"
import { useMemo, useRef, useState } from "react"
import CreateExperiment from "./_components/CreateExperiment"
import ExperimentStatusDisplay from "./_components/ExperimentStatusDisplay"
import { CreateExperimentDto } from "./_domain/dto/experiment"
import { Experiment, ExperimentStatus } from "./_domain/entity/experiment"
import { ExperimentListFilter } from "./_types/experiment"

const ExperimentPageClient = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
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

  const createExperimentMutation = useCreateExperiment()

  // Stabilize error message to prevent infinite loops
  const errorMessage = useMemo(
    () => createExperimentMutation.error?.message ?? null,
    [createExperimentMutation.error?.message]
  )

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false)
    createExperimentMutation.reset()
  }

  const handleCreateExperiment = (data: CreateExperimentDto) => {
    createExperimentMutation.mutate(data, {
      onSuccess: () => {
        notify("Experiment created successfully", "success")
        setOpenCreateDialog(false)
      }
    })
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
      field: "createdAt",
      headerName: "Created At",
      flex: 0.4,
      valueGetter: (_, row) => {
        return format(row.createdAt as Date, "dd/MM/yyyy HH:mm")
      }
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
      <CreateExperiment
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        onSubmit={handleCreateExperiment}
        loading={createExperimentMutation.isPending}
        disabled={createExperimentMutation.isPending}
        error={errorMessage}
        success={createExperimentMutation.isSuccess}
      />
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
              onClick: () => setOpenCreateDialog(true)
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

export default ExperimentPageClient
