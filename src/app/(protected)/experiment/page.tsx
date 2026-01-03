"use client"

import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { Alert, Box, IconButton, Snackbar, Stack, Typography } from "@mui/material"
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams
} from "@mui/x-data-grid"
import { useGetIdentity } from "@refinedev/core"
import TableToolbar from "components/filter/TableToolbar"
import Popup from "components/popup"
import State from "components/state"
import { navigationRoutes } from "consts/navigation"
import { format } from "date-fns"
import {
  useCreateExperiment,
  useDeleteExperiment,
  useExperimentList
} from "hooks/queries/experiment"
import { useResponsiveHeight } from "hooks/responsive"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { PermissionCode } from "../user-and-access/role/_const/permission"
import { User } from "../user-and-access/user/_domain/entity/user"
import CreateExperiment from "./_components/CreateExperiment"
import { CreateExperimentDto } from "./_domain/dto/experiment"
import { Experiment } from "./_domain/entity/experiment"
import { ExperimentListFilter } from "./_types/experiment"

const ExperimentPage = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null)
  const [experimentListFilter, setExperimentListFilter] = useState<ExperimentListFilter>({
    search: "",
    page: 1,
    pageSize: 10
  })
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)
  const tableHeight = useResponsiveHeight(tableRef)

  const { data: experimentsData, isLoading } = useExperimentList(experimentListFilter)

  useEffect(() => {
    console.log(experimentsData)
  }, [experimentsData])

  const { data: identity } = useGetIdentity<User>()

  const deleteExperimentMutation = useDeleteExperiment()
  const router = useRouter()

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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
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
        setSnackbarOpen(true)
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
          setSnackbarOpen(true)
        },
        onError: (error) => {
          setSnackbarOpen(true)
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
      flex: 0.6
    },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      resizable: false,
      flex: 0.4
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
      flex: 0.6,
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

  if (
    identity &&
    (!identity.permissionCodes?.includes(PermissionCode.EXPERIMENT_VIEW) ||
      !identity.permissionCodes?.includes(PermissionCode.EXPERIMENT_MANAGE))
  ) {
    return (
      <State.Forbidden description="Only users with permission to view and manage experiment can access this page." />
    )
  }

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
          severity={deleteExperimentMutation.isError ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {deleteExperimentMutation.isError
            ? deleteExperimentMutation.error.message
            : "User deleted successfully"}
        </Alert>
      </Snackbar>
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

export default ExperimentPage
